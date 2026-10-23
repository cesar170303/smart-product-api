from sqlalchemy.exc import IntegrityError

from core.exceptions import ConflictException
from core.security import get_password_hash
from models.User import UserCreate, UserModel
from repository.user_repository import UserRepository

EMAIL_TAKEN_MESSAGE = "Ya existe una cuenta con ese email"


def register_user(repository: UserRepository, user_data: UserCreate):
    """
    Registra un nuevo usuario en la base de datos. El rol siempre es "user":
    un admin se crea a mano en la BD, nunca desde la API.
    """
    if repository.get_user_by_email(user_data.email):
        raise ConflictException(EMAIL_TAKEN_MESSAGE)

    db_user = UserModel(
        name=user_data.name,
        email=user_data.email,
        location=user_data.location,
        hashed_password=get_password_hash(user_data.password),
    )

    try:
        repository.add_user(db_user)
    except IntegrityError:
        # Dos registros simultáneos con el mismo email: el índice único de la BD deja pasar solo uno
        repository.rollback()
        raise ConflictException(EMAIL_TAKEN_MESSAGE)

    return db_user
