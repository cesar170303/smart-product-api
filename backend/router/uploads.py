from fastapi import APIRouter, Depends, File, Request, UploadFile, status

from core.dependencies import get_current_user
from core.exceptions import PayloadTooLargeException
from core.rate_limit import limiter
from models.User import UserModel
from services.image_storage import MAX_UPLOAD_BYTES
from use_cases.UploadImage import upload_image

router = APIRouter(tags=["Uploads"])

# Margen para las cabeceras y los separadores del multipart, que cuentan en Content-Length pero no son la foto
MULTIPART_OVERHEAD_BYTES = 64 * 1024

uploads_limit = limiter.shared_limit("10/minute", scope="uploads")


@router.post("/uploads", status_code=status.HTTP_201_CREATED)
@uploads_limit
def add_upload(request: Request, file: UploadFile = File(...), current_user: UserModel = Depends(get_current_user)):
    # Rechazo rápido si el cliente ya declara un cuerpo enorme. Se puede falsear, por eso
    # upload_image vuelve a comprobar el tamaño real mientras lee.
    content_length = request.headers.get("content-length")
    if content_length and content_length.isdigit() and int(content_length) > MAX_UPLOAD_BYTES + MULTIPART_OVERHEAD_BYTES:
        raise PayloadTooLargeException(f"La imagen no puede superar {MAX_UPLOAD_BYTES // (1024 * 1024)} MB")

    # def (no async def): FastAPI lo ejecuta en un hilo aparte y el trabajo pesado de Pillow no bloquea el servidor
    image_url = upload_image(file.file)
    return {"image_url": image_url}
