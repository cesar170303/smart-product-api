import re
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from pydantic import field_validator
from sqlmodel import Field, Relationship, SQLModel

from models.common import created_at_field, enum_column_type

if TYPE_CHECKING:
    from models.Order import OrderModel
    from models.Product import ProductModel

# Validación sencilla de email (algo@dominio.ext) sin depender de email-validator
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class UserBase(SQLModel):
    name: str = Field(min_length=2, max_length=100)
    location: str | None = Field(default=None, max_length=100)


class UserModel(UserBase, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str
    role: UserRole = Field(default=UserRole.USER, sa_type=enum_column_type(UserRole, "user_role"), nullable=False)
    created_at: datetime = created_at_field()

    products: list["ProductModel"] = Relationship(back_populates="seller")
    orders: list["OrderModel"] = Relationship(back_populates="buyer")


class UserCreate(UserBase):
    """Lo que envía el cliente al registrarse. No tiene `role`: nadie puede darse permisos de admin desde el JSON."""
    email: str = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email", mode="after")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        # "Ana@Mail.com " y "ana@mail.com" son la misma cuenta
        value = value.strip().lower()
        if not EMAIL_PATTERN.match(value):
            raise ValueError("El email no tiene un formato válido")
        return value


class UserRead(UserBase):
    """Lo que devuelve la API de un usuario. Nunca incluye hashed_password."""
    id: int
    email: str
    role: UserRole
    created_at: datetime


class SellerRead(UserBase):
    """Datos públicos del vendedor que se muestran dentro de un producto (sin email ni rol)."""
    id: int


class UserRegisterResponse(SQLModel):
    mensaje: str
    usuario: UserRead
