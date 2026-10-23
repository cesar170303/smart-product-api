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

# Pillow avisa de las "bombas de descompresión" (imágenes pequeñas en bytes pero gigantes en píxeles) por encima de este límite
Image.MAX_IMAGE_PIXELS = 40_000_000

# Formato REAL detectado por Pillow -> extensión con la que se guarda. Lo que diga el cliente da igual.
FORMAT_EXTENSIONS = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp"}

# Única forma válida de image_url: /media/<32 hexadecimales>.<ext>. Sirve para validar la entrada
# y para asegurarnos de que solo tocamos archivos nuestros al borrar (sin "../" posible).
IMAGE_URL_PATTERN = re.compile(r"^/media/([0-9a-f]{32})\.(jpg|png|webp)$")


class InvalidImageError(Exception):
    """El archivo no es una imagen JPEG, PNG o WEBP válida."""


def save_image(file_bytes: bytes) -> str:
    """Valida la imagen, la reduce, la vuelve a guardar y devuelve su ruta pública (/media/<uuid>.<ext>).

    Al volver a guardarla desde cero se pierden los metadatos EXIF (incluida la ubicación GPS de la foto)
    y cualquier contenido extraño escondido dentro del archivo."""
    try:
        with warnings.catch_warnings():
            # Una imagen demasiado grande en píxeles se trata como error, no como simple aviso
            warnings.simplefilter("error", Image.DecompressionBombWarning)

            with Image.open(BytesIO(file_bytes)) as image:
                image_format = image.format
                if image_format not in FORMAT_EXTENSIONS:
                    raise InvalidImageError("Formato no permitido")

                # Primero se aplica la rotación guardada en el EXIF; si no, la foto saldría girada al borrarlo
                image = ImageOps.exif_transpose(image)
                image.thumbnail((MAX_SIDE_PIXELS, MAX_SIDE_PIXELS))

                if image_format == "JPEG" and image.mode not in ("RGB", "L"):
                    image = image.convert("RGB")  # JPEG no admite transparencia ni paleta

                UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
                file_name = f"{uuid.uuid4().hex}.{FORMAT_EXTENSIONS[image_format]}"
                file_path = UPLOAD_DIR / file_name

                try:
                    image.save(file_path, format=image_format)
                except Exception:
                    file_path.unlink(missing_ok=True)  # no dejar un archivo a medias
                    raise
    except InvalidImageError:
        raise
    except (UnidentifiedImageError, Image.DecompressionBombError, Image.DecompressionBombWarning, OSError, SyntaxError, ValueError) as error:
        raise InvalidImageError("No se pudo leer la imagen") from error

    return f"{MEDIA_URL_PREFIX}/{file_name}"


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
