from sqlmodel import SQLModel, Field
from services.pricing import PRICING_CALCULATORS, PricingStrategy

class ProductModel(SQLModel, table=True):

    id : int | None = Field(default=None, primary_key=True)
    name:str
    price: float
    category:str = "Pendiente de IA"

    def apply_pricing_rules(self):
        calculador = PRICING_CALCULATORS.get(self.category, PricingStrategy())
        self.price = calculador.calculate_final_price(self.price)
