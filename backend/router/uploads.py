from fastapi import APIRouter, Depends, File, Request, UploadFile, status
from fastapi.responses import FileResponse
from sqlmodel import Session

from core.database import get_session
from core.dependencies import get_current_user
from core.exceptions import NotFoundException, PayloadTooLargeException
from core.rate_limit import limiter
from models.UploadedFile import UploadedFileRead
from models.User import UserModel
from repository.uploaded_file_repository import UploadedFileRepository
from services.image_storage import MAX_UPLOAD_BYTES, MEDIA_TYPES, MEDIA_URL_PREFIX, media_path
from use_cases.UploadImage import upload_image

router = APIRouter(tags=["Uploads"])

# Margen para las cabeceras y los separadores del multipart, que cuentan en Content-Length pero no son la foto
MULTIPART_OVERHEAD_BYTES = 64 * 1024

uploads_limit = limiter.shared_limit("10/minute", scope="uploads")


@router.post("/uploads", status_code=status.HTTP_201_CREATED, response_model=UploadedFileRead)
@uploads_limit
def add_upload(request: Request, file: UploadFile = File(...), session: Session = Depends(get_session), current_user: UserModel = Depends(get_current_user)):
    # Rechazo rápido si el cliente ya declara un cuerpo enorme. Se puede falsear, por eso
    # upload_image vuelve a comprobar el tamaño real mientras lee.
    content_length = request.headers.get("content-length")
    if content_length and content_length.isdigit() and int(content_length) > MAX_UPLOAD_BYTES + MULTIPART_OVERHEAD_BYTES:
        raise PayloadTooLargeException(f"La imagen no puede superar {MAX_UPLOAD_BYTES // (1024 * 1024)} MB")

    # def (no async def): FastAPI lo ejecuta en un hilo aparte y el trabajo pesado de Pillow no bloquea el servidor
    repository = UploadedFileRepository(session)
    upload = upload_image(file.file, file.filename or "", current_user, repository)
    return UploadedFileRead(image_url=f"{MEDIA_URL_PREFIX}/{upload.storage_name}", original_name=upload.original_name)


@router.get("/media/{file_name}")
def get_media(file_name: str):
    # Solo se sirven fotos con el nombre que les damos nosotros. nosniff impide que el navegador adivine otro tipo.
    file_path = media_path(file_name)
    if file_path is None:
        raise NotFoundException("La imagen no existe")
    return FileResponse(file_path, media_type=MEDIA_TYPES[file_path.suffix[1:]], headers={"X-Content-Type-Options": "nosniff"})
