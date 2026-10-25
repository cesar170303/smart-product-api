from datetime import datetime

from sqlmodel import Field, SQLModel

from models.common import created_at_field


class UploadedFileModel(SQLModel, table=True):
    """Registro de cada foto subida: quién la subió, cómo se llamaba y con qué nombre se guardó en disco.
    El nombre original solo vive aquí, nunca en el disco."""
    __tablename__ = "uploaded_files"

    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="users.id", index=True)
    original_name: str = Field(max_length=255)
    # 32 hex + "." + extensión, por ejemplo "<uuid>.jpg"
    storage_name: str = Field(unique=True, index=True, max_length=40)
    mime_type: str = Field(max_length=50)
    size_bytes: int
    created_at: datetime = created_at_field()


class UploadedFileRead(SQLModel):
    """Lo que devuelve POST /uploads: la ruta para usar en el producto y el nombre original para mostrarlo."""
    image_url: str
    original_name: str
