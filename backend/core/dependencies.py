import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from core.database import get_session
from core.security import decode_access_token
from models.User import UserModel
from repository.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> UserModel:
    """Valida el JWT (firma, caducidad y claims) y devuelve el usuario al que pertenece.
    Cualquier fallo termina en un 401."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se han podido validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token ha expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise credentials_exception

    # El sub es el id del usuario. Un token antiguo (con el username) no es un número y se rechaza.
    try:
        user_id = int(payload["sub"])
    except (TypeError, ValueError):
        raise credentials_exception

    repo = UserRepository(session)
    user = repo.get_user_by_id(user_id)

    if user is None:
        raise credentials_exception

    return user
