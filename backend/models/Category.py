from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from models.Product import ProductModel


class CategoryBase(SQLModel):
    name: str = Field(min_length=2, max_length=50)


class CategoryModel(CategoryBase, table=True):
    __tablename__ = "categories"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True, min_length=2, max_length=50)

    products: list["ProductModel"] = Relationship(back_populates="category")


class CategoryRead(CategoryBase):
    id: int
