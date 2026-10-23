from core.database import get_session
from core.security import DUMMY_PASSWORD_HASH, create_access_token, verify_password
from core.rate_limit import limiter
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from models.User import UserCreate, UserRegisterResponse
from repository.user_repository import UserRepository
from use_cases.RegisterUser import register_user

router = APIRouter(tags=["Authentication"])

@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    # El estándar OAuth2 llama al campo "username"; aquí lo que viaja en él es el email

    repo = UserRepository(session)
    db_user = repo.get_user_by_email(form_data.username)

    # Se verifica siempre una contraseña (contra un hash de relleno si el email no existe)
    # para que la respuesta tarde igual y no se pueda averiguar qué emails están registrados
    password_is_valid = verify_password(form_data.password, db_user.hashed_password if db_user else DUMMY_PASSWORD_HASH)

    if not db_user or not password_is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # En el token va el id (no cambia nunca); el rol se lee de la BD en cada petición, así que quitar un admin surte efecto al instante
    access_token = create_access_token(data={"sub": str(db_user.id)})

    return {"access_token": access_token, "token_type": "bearer"}




@router.post("/register", response_model=UserRegisterResponse, status_code=status.HTTP_201_CREATED)
def register_users(user: UserCreate, session: Session = Depends(get_session)):

    repo = UserRepository(session)
    db_user = register_user(repository=repo, user_data=user)
    return {"mensaje": "Usuario registrado correctamente", "usuario": db_user}
