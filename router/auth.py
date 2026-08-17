from core.security import create_access_token, verify_password
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(tags=["Authentication"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    if form_data.username != "cesar":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario incorrecto")

    if form_data.password != "1234":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Contraseña incorrecta")

    access_token = create_access_token(data={"sub": form_data.username})

    return {"access_token": access_token, "token_type": "bearer"}