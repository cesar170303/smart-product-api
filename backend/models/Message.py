from datetime import datetime
from typing import Optional

from pydantic import field_validator
from sqlalchemy import Text
from sqlmodel import Field, Relationship, SQLModel

from models.Product import ProductModel, ProductStatus
from models.User import UserModel
from models.common import created_at_field

MAX_MESSAGE_LENGTH = 1000


class MessageCreate(SQLModel):
    """Lo que envía el cliente al escribir un mensaje. No lleva remitente ni fecha: salen del token y del servidor.
    `buyer_id` solo lo usa el vendedor, para decir a qué comprador contesta (el comprador siempre habla como él mismo)."""
    body: str = Field(min_length=1, max_length=MAX_MESSAGE_LENGTH)
    buyer_id: int | None = None

    @field_validator("body")
    @classmethod
    def body_must_not_be_blank(cls, value: str) -> str:
        # "   " pasa el mínimo de longitud, pero no es un mensaje
        value = value.strip()
        if not value:
            raise ValueError("El mensaje no puede estar vacío")
        return value


class MessageModel(SQLModel, table=True):
    """Un mensaje de una conversación. Una conversación es un producto más un comprador:
    el vendedor es siempre el dueño del producto, así que no hace falta guardarlo."""
    __tablename__ = "messages"

    id: int | None = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="products.id", index=True)
    buyer_id: int = Field(foreign_key="users.id", index=True)
    sender_id: int = Field(foreign_key="users.id")
    body: str = Field(sa_type=Text, min_length=1, max_length=MAX_MESSAGE_LENGTH)
    created_at: datetime = created_at_field()

    # Dos claves foráneas apuntan a users: hay que decir cuál usa cada relación
    product: Optional[ProductModel] = Relationship()
    buyer: Optional[UserModel] = Relationship(sa_relationship_kwargs={"foreign_keys": "[MessageModel.buyer_id]"})
    sender: Optional[UserModel] = Relationship(sa_relationship_kwargs={"foreign_keys": "[MessageModel.sender_id]"})


class ParticipantRead(SQLModel):
    """Lo mínimo público de una persona dentro de una conversación (sin email ni rol)."""
    id: int
    name: str


class MessageRead(SQLModel):
    id: int
    product_id: int
    buyer_id: int
    sender_id: int
    body: str
    created_at: datetime
    sender: ParticipantRead


class ConversationProduct(SQLModel):
    id: int
    name: str
    price: float
    image_url: str
    status: ProductStatus


class ConversationRead(SQLModel):
    """Una fila de la bandeja: el producto, la otra persona y el último mensaje."""
    product: ConversationProduct
    buyer_id: int
    other: ParticipantRead
    last_message: MessageRead
