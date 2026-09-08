from core.database import get_session
from core.security import create_access_token, verify_password
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from models.User import UserCreate
from repository.user_repository import UserRepository
from use_cases.RegisterUser import register_user

router = APIRouter(tags=["Authentication"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):

    repo = UserRepository(session)
    db_user = repo.get_user_by_username(form_data.username)
    
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
        
    access_token = create_access_token(data={"sub": db_user.username})

    return {"access_token": access_token, "token_type": "bearer"}




@router.post("/register")
def register_users(user: UserCreate, session: Session = Depends(get_session)):

    repo = UserRepository(session)
    db_user = register_user(repository=repo, user_data=user)
    return {"mensaje": "Usuario registrado correctamente", "Usuario": db_user}