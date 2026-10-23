from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from models.Product import ProductModel, ProductRead
from models.User import UserModel
from models.common import created_at_field, enum_column_type


class OrderStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class OrderCreate(SQLModel):
    """Solo se indica el producto: el comprador sale del token, nunca del JSON."""
    product_id: int


class OrderStatusUpdate(SQLModel):
    status: OrderStatus


class OrderModel(SQLModel, table=True):
    __tablename__ = "orders"

    id: int | None = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="products.id", index=True)
    buyer_id: int = Field(foreign_key="users.id", index=True)
    status: OrderStatus = Field(
        default=OrderStatus.PENDING,
        sa_type=enum_column_type(OrderStatus, "order_status"),
        nullable=False,
    )
    created_at: datetime = created_at_field()

    product: Optional[ProductModel] = Relationship(back_populates="orders")
    buyer: Optional[UserModel] = Relationship(back_populates="orders")


class OrderRead(SQLModel):
    id: int
    buyer_id: int
    status: OrderStatus
    created_at: datetime
    product: ProductRead
