from sqlmodel import SQLModel, Field
from services.pricing import PRICING_CALCULATORS, PricingStrategy


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
        calculador = PRICING_CALCULATORS.get(self.category, PricingStrategy())
        self.price = calculador.calculate_final_price(self.price)

class ProductPublic(ProductBase):
    id : int