from sqlmodel import SQLModel, Field
from services.pricing import get_pricing_strategy


class ProductBase(SQLModel):

    name:str = Field(min_length=3)
    price: float = Field(gt=0)
    category: str
    

class ProductCreate(ProductBase):
    pass


class ProductModel(ProductBase, table=True):

    id : int | None = Field(default=None, primary_key=True)
    provider_secret_cost: float = 2.0

    def apply_pricing_rules(self):
        self.price = get_pricing_strategy(self.category).calculate_final_price(self.price)

class ProductPublic(ProductBase):
    id : int