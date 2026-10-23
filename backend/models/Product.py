from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from pydantic import field_validator
from sqlalchemy import CheckConstraint, Text
from sqlmodel import Field, Relationship, SQLModel

from models.Category import CategoryModel, CategoryRead
from models.common import created_at_field, enum_column_type
from models.User import SellerRead, UserModel
from services.image_storage import IMAGE_URL_PATTERN

if TYPE_CHECKING:
    from models.Order import OrderModel


class ProductStatus(str, Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    SOLD = "sold"


class ProductBase(SQLModel):
    name: str = Field(min_length=3, max_length=150)
    description: str = Field(min_length=1, max_length=5000)
    price: float = Field(gt=0)
    image_url: str = Field(min_length=1, max_length=500)


class ProductCreate(ProductBase):
    """Lo que envía el cliente al crear o editar un anuncio.
    No tiene user_id, status ni id: el dueño sale del token y el estado lo gestionan los pedidos.
    `category` es el nombre; si va vacío, se pide a Gemini."""
    category: str | None = Field(default=None, max_length=50)

    @field_validator("image_url")
    @classmethod
    def image_url_must_be_an_uploaded_photo(cls, value: str) -> str:
        # Solo se admiten rutas devueltas por POST /uploads: así no se cuelan URLs externas ni cosas como "javascript:..."
        # (la validación está aquí y no en ProductBase para no bloquear la lectura de datos antiguos)
        if not IMAGE_URL_PATTERN.fullmatch(value):
            raise ValueError("image_url debe ser la ruta que devuelve POST /uploads")
        return value


class ProductModel(ProductBase, table=True):
    __tablename__ = "products"
    __table_args__ = (CheckConstraint("price > 0", name="ck_products_price_positive"),)

    id: int | None = Field(default=None, primary_key=True)
    description: str = Field(sa_type=Text, min_length=1, max_length=5000)
    status: ProductStatus = Field(
        default=ProductStatus.AVAILABLE,
        sa_type=enum_column_type(ProductStatus, "product_status"),
        nullable=False,
    )
    user_id: int = Field(foreign_key="users.id", index=True)
    category_id: int = Field(foreign_key="categories.id", index=True)
    created_at: datetime = created_at_field()

    seller: Optional[UserModel] = Relationship(back_populates="products")
    category: Optional[CategoryModel] = Relationship(back_populates="products")
    orders: list["OrderModel"] = Relationship(back_populates="product")


class ProductRead(ProductBase):
    id: int
    status: ProductStatus
    created_at: datetime
    category: CategoryRead
    seller: SellerRead
