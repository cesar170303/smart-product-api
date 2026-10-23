from typing import BinaryIO

from core.exceptions import PayloadTooLargeException, UnsupportedMediaTypeException
from services.image_storage import MAX_UPLOAD_BYTES, InvalidImageError, save_image


def upload_image(file: BinaryIO) -> str:
    """Valida y guarda una foto subida. Devuelve la ruta pública (/media/<uuid>.<ext>)."""
    # Se lee un byte de más: si llega, el archivo supera el máximo y ni lo procesamos
    # (así nadie nos obliga a cargar en memoria un archivo de cientos de MB)
    file_bytes = file.read(MAX_UPLOAD_BYTES + 1)

    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise PayloadTooLargeException(f"La imagen no puede superar {MAX_UPLOAD_BYTES // (1024 * 1024)} MB")

    try:
        return save_image(file_bytes)
    except InvalidImageError:
        raise UnsupportedMediaTypeException("El archivo no es una imagen válida (solo JPEG, PNG o WEBP)")
