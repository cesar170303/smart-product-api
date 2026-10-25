import logging
import re
import uuid
import warnings
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError

logger = logging.getLogger(__name__)

# Carpeta donde se guardan las fotos (backend/uploads) y prefijo con el que se sirven (GET /media/...)
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
MEDIA_URL_PREFIX = "/media"

MAX_UPLOAD_BYTES = 5 * 1024 * 1024
MAX_SIDE_PIXELS = 1600
MAX_ORIGINAL_NAME_LENGTH = 255

# Pillow avisa de las "bombas de descompresión" (imágenes pequeñas en bytes pero gigantes en píxeles) por encima de este límite
Image.MAX_IMAGE_PIXELS = 40_000_000

# Extensión que dice el nombre del cliente -> extensión con la que se guarda (jpeg cuenta como jpg). Lo demás se rechaza.
ALLOWED_EXTENSIONS = {"jpg": "jpg", "jpeg": "jpg", "png": "png", "webp": "webp"}

# Formato REAL detectado por Pillow -> extensión con la que se guarda. Lo que diga el cliente da igual.
FORMAT_EXTENSIONS = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp"}

# Content-Type con el que se sirve cada extensión guardada
MEDIA_TYPES = {"jpg": "image/jpeg", "png": "image/png", "webp": "image/webp"}

# Única forma válida de image_url: /media/<32 hexadecimales>.<ext>. Sirve para validar la entrada
# y para asegurarnos de que solo tocamos o servimos archivos nuestros (sin "../" posible).
IMAGE_URL_PATTERN = re.compile(r"^/media/([0-9a-f]{32})\.(jpg|png|webp)$")


class InvalidImageError(Exception):
    """El archivo no es una imagen JPEG, PNG o WEBP válida."""


def sanitize_original_name(original_name: str) -> str:
    """Nombre original seguro para guardarlo en la BD y mostrarlo. Solo se queda con el nombre base (sin carpetas),
    sin caracteres de control. Nunca se usa para construir una ruta en disco."""
    # Se corta por "\" (Windows) y por "/" (Unix) para quedarse con lo último: el nombre del archivo
    base = re.split(r"[\\/]", original_name)[-1]
    base = "".join(char for char in base if char.isprintable())
    base = base.strip()[:MAX_ORIGINAL_NAME_LENGTH].strip()
    return base or "imagen"


def extension_of(name: str) -> str:
    """Extensión en minúsculas y sin punto ("foto.PNG" -> "png"). Vacía si el nombre no tiene."""
    _, dot, extension = name.rpartition(".")
    return extension.lower() if dot else ""


def _has_signature(file_bytes: bytes, extension: str) -> bool:
    """Mira los primeros bytes del archivo (su firma). Un JPEG renombrado a .png no pasa."""
    if extension == "jpg":
        return file_bytes.startswith(b"\xff\xd8\xff")
    if extension == "png":
        return file_bytes.startswith(b"\x89PNG\r\n\x1a\n")
    if extension == "webp":
        return file_bytes[:4] == b"RIFF" and file_bytes[8:12] == b"WEBP"
    return False


def save_image(file_bytes: bytes, extension: str) -> tuple[str, int]:
    """Valida la imagen, la reduce y la vuelve a guardar con un nombre nuevo. Devuelve (nombre en disco, bytes).

    `extension` es la ya validada (jpg, png o webp) y el contenido tiene que coincidir con ella, tanto en la firma
    como en el formato que detecta Pillow.

    Al volver a guardarla desde cero se pierden los metadatos EXIF (incluida la ubicación GPS de la foto)
    y cualquier contenido extraño escondido dentro del archivo."""
    if not _has_signature(file_bytes, extension):
        raise InvalidImageError("El contenido no coincide con la extensión")

    try:
        with warnings.catch_warnings():
            # Una imagen demasiado grande en píxeles se trata como error, no como simple aviso
            warnings.simplefilter("error", Image.DecompressionBombWarning)

            with Image.open(BytesIO(file_bytes)) as image:
                image_format = image.format
                if FORMAT_EXTENSIONS.get(image_format) != extension:
                    raise InvalidImageError("El contenido no coincide con la extensión")

                # Primero se aplica la rotación guardada en el EXIF; si no, la foto saldría girada al borrarlo
                image = ImageOps.exif_transpose(image)
                image.thumbnail((MAX_SIDE_PIXELS, MAX_SIDE_PIXELS))

                if image_format == "JPEG" and image.mode not in ("RGB", "L"):
                    image = image.convert("RGB")  # JPEG no admite transparencia ni paleta

                UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
                file_name = f"{uuid.uuid4().hex}.{extension}"
                file_path = UPLOAD_DIR / file_name

                try:
                    image.save(file_path, format=image_format)
                except Exception:
                    file_path.unlink(missing_ok=True)  # no dejar un archivo a medias
                    raise
                size_bytes = file_path.stat().st_size
    except InvalidImageError:
        raise
    except (UnidentifiedImageError, Image.DecompressionBombError, Image.DecompressionBombWarning, OSError, SyntaxError, ValueError) as error:
        raise InvalidImageError("No se pudo leer la imagen") from error

    return file_name, size_bytes


def media_path(file_name: str) -> Path | None:
    """Ruta en disco de una foto que se sirve en /media. Solo si el nombre tiene la forma de las nuestras y existe."""
    if not IMAGE_URL_PATTERN.fullmatch(f"{MEDIA_URL_PREFIX}/{file_name}"):
        return None
    file_path = UPLOAD_DIR / file_name
    return file_path if file_path.is_file() else None


def delete_image(image_url: str | None) -> None:
    """Borra del disco la foto de esa ruta. Si no tiene la forma de las nuestras, no toca nada."""
    match = IMAGE_URL_PATTERN.fullmatch(image_url or "")
    if not match:
        return

    file_path = UPLOAD_DIR / f"{match.group(1)}.{match.group(2)}"
    try:
        file_path.unlink(missing_ok=True)
    except OSError:
        # Que no se pueda borrar un archivo no debe romper la petición del usuario
        logger.exception("No se pudo borrar la imagen %s", file_path)
