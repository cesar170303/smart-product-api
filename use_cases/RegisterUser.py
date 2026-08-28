from models.User import UserCreate, UserModel
from repository.user_repository import UserRepository
from core.security import get_password_hash

def register_user(repository: UserRepository, user_data: UserCreate):
    """
    Registra un nuevo usuario en la base de datos.
    """
    hashed_password = get_password_hash(user_data.password)
    
    db_user = UserModel(username=user_data.username, hashed_password=hashed_password)

    repository.add_user(db_user)

    return db_user