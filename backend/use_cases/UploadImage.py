from typing import BinaryIO

from core.exceptions import PayloadTooLargeException, UnsupportedMediaTypeException
from models.UploadedFile import UploadedFileModel
from models.User import UserModel
from repository.uploaded_file_repository import UploadedFileRepository
from services.image_storage import (
    ALLOWED_EXTENSIONS,
    MAX_UPLOAD_BYTES,
    MEDIA_TYPES,
    MEDIA_URL_PREFIX,
    InvalidImageError,
    delete_image,
    extension_of,
    sanitize_original_name,
    save_image,
)


def upload_image(file: BinaryIO, original_name: str, owner: UserModel, repository: UploadedFileRepository) -> UploadedFileModel:
    """Valida y guarda una foto subida, y deja constancia de quién la subió y cómo se llamaba."""
    # La extensión se comprueba antes de leer el archivo: si no es de las permitidas, ni se procesa
    name = sanitize_original_name(original_name)
    extension = ALLOWED_EXTENSIONS.get(extension_of(name))
    if extension is None:
        raise UnsupportedMediaTypeException("Solo se admiten fotos JPEG, PNG o WEBP")

    # Se lee un byte de más: si llega, el archivo supera el máximo y ni lo procesamos
    # (así nadie nos obliga a cargar en memoria un archivo de cientos de MB)
    file_bytes = file.read(MAX_UPLOAD_BYTES + 1)

    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise PayloadTooLargeException(f"La imagen no puede superar {MAX_UPLOAD_BYTES // (1024 * 1024)} MB")

    try:
        storage_name, size_bytes = save_image(file_bytes, extension)
    except InvalidImageError:
        raise UnsupportedMediaTypeException("El archivo no es una imagen válida (solo JPEG, PNG o WEBP)")

    upload = UploadedFileModel(
        owner_id=owner.id,
        original_name=name,
        storage_name=storage_name,
        mime_type=MEDIA_TYPES[extension],
        size_bytes=size_bytes,
    )
    try:
        repository.add(upload)
    except Exception:
        delete_image(f"{MEDIA_URL_PREFIX}/{storage_name}")  # no dejar una foto sin registro
        raise
    return upload
