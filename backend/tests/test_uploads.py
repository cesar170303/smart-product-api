"""Pruebas de las fotos subidas. No necesitan base de datos: el repositorio es falso y las fotos van a una carpeta temporal.

Se ejecutan desde backend/ con:  python -m unittest discover -s tests -t . -v
"""
import io
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from PIL import Image

from core.exceptions import UnsupportedMediaTypeException
from services import image_storage
from services.image_storage import media_path, sanitize_original_name
from use_cases.UploadImage import upload_image

OWNER = SimpleNamespace(id=7)
EXISTING_NAME = "0123456789abcdef0123456789abcdef.png"


def image_bytes(format_name: str) -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", (16, 16), "red").save(buffer, format=format_name)
    return buffer.getvalue()


class FakeUploadedFileRepository:
    def __init__(self):
        self.rows = []

    def add(self, item):
        item.id = len(self.rows) + 1
        self.rows.append(item)


class StorageTestCase(unittest.TestCase):
    """Manda UPLOAD_DIR a una carpeta temporal para no dejar fotos en backend/uploads."""

    def setUp(self):
        temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(temp_dir.cleanup)
        self.upload_dir = Path(temp_dir.name)
        patcher = patch.object(image_storage, "UPLOAD_DIR", self.upload_dir)
        patcher.start()
        self.addCleanup(patcher.stop)


class SanitizeOriginalNameTests(unittest.TestCase):
    def test_quita_rutas_unix_y_windows(self):
        self.assertEqual(sanitize_original_name("../../etc/passwd"), "passwd")
        self.assertEqual(sanitize_original_name("..\\..\\Windows\\foto.png"), "foto.png")
        self.assertEqual(sanitize_original_name("C:\\fotos\\casa.jpg"), "casa.jpg")

    def test_quita_caracteres_de_control_y_espacios(self):
        self.assertEqual(sanitize_original_name("  fo\x00to\r\n.png  "), "foto.png")

    def test_limita_a_255_caracteres(self):
        self.assertEqual(len(sanitize_original_name("a" * 300 + ".png")), 255)

    def test_nombre_vacio_usa_imagen(self):
        self.assertEqual(sanitize_original_name(""), "imagen")
        self.assertEqual(sanitize_original_name("   "), "imagen")
        self.assertEqual(sanitize_original_name("carpeta/"), "imagen")


class UploadImageTests(StorageTestCase):
    def setUp(self):
        super().setUp()
        self.repository = FakeUploadedFileRepository()

    def upload(self, data, name):
        return upload_image(io.BytesIO(data), name, OWNER, self.repository)

    def test_extension_no_permitida_da_415_sin_guardar_nada(self):
        with self.assertRaises(UnsupportedMediaTypeException) as context:
            self.upload(image_bytes("PNG"), "foto.gif")
        self.assertEqual(context.exception.status_code, 415)
        self.assertEqual(list(self.upload_dir.iterdir()), [])
        self.assertEqual(self.repository.rows, [])

    def test_sin_extension_da_415(self):
        with self.assertRaises(UnsupportedMediaTypeException):
            self.upload(image_bytes("PNG"), "foto")

    def test_jpeg_con_nombre_png_da_415(self):
        # La firma es de JPEG pero el nombre dice PNG: no coinciden, así que no se guarda
        with self.assertRaises(UnsupportedMediaTypeException):
            self.upload(image_bytes("JPEG"), "foto.png")
        self.assertEqual(list(self.upload_dir.iterdir()), [])
        self.assertEqual(self.repository.rows, [])

    def test_texto_con_extension_jpg_da_415(self):
        with self.assertRaises(UnsupportedMediaTypeException):
            self.upload(b"<html>no soy una foto</html>", "foto.jpg")

    def test_png_real_se_guarda_con_nombre_uuid_y_original_en_el_registro(self):
        upload = self.upload(image_bytes("PNG"), "foto.png")

        self.assertRegex(upload.storage_name, r"^[0-9a-f]{32}\.png$")
        self.assertEqual(upload.original_name, "foto.png")
        self.assertEqual(upload.owner_id, OWNER.id)
        self.assertEqual(upload.mime_type, "image/png")
        self.assertTrue((self.upload_dir / upload.storage_name).is_file())
        self.assertEqual(self.repository.rows, [upload])

    def test_jpeg_con_extension_jpeg_se_guarda_como_jpg(self):
        upload = self.upload(image_bytes("JPEG"), "foto.JPEG")

        self.assertTrue(upload.storage_name.endswith(".jpg"))
        self.assertEqual(upload.mime_type, "image/jpeg")

    def test_nombre_con_ruta_no_escribe_fuera_de_la_carpeta(self):
        upload = self.upload(image_bytes("PNG"), "../../../escape.png")

        self.assertEqual(upload.original_name, "escape.png")
        self.assertEqual([path.name for path in self.upload_dir.iterdir()], [upload.storage_name])


class MediaPathTests(StorageTestCase):
    def test_solo_sirve_nombres_con_forma_de_foto_que_existe(self):
        self.assertIsNone(media_path(EXISTING_NAME))  # todavía no existe

        (self.upload_dir / EXISTING_NAME).write_bytes(b"x")
        self.assertEqual(media_path(EXISTING_NAME), self.upload_dir / EXISTING_NAME)

    def test_rechaza_rutas_y_archivos_que_no_son_fotos(self):
        (self.upload_dir / "notas.txt").write_bytes(b"x")

        self.assertIsNone(media_path("../" + EXISTING_NAME))
        self.assertIsNone(media_path("notas.txt"))
        self.assertIsNone(media_path(EXISTING_NAME + "\n"))


if __name__ == "__main__":
    unittest.main()
