from models.UploadedFile import UploadedFileModel
from repository.base_repository import BaseRepository
from sqlmodel import Session


class UploadedFileRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(session, UploadedFileModel)
