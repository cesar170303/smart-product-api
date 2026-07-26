from pydantic import BaseModel
from pricing import PRICING_CALCULATORS, PricingStrategy

class ProductModel(BaseModel):
    name:str
    price: float
    category:str = "Pendiente de IA"

    def apply_pricing_rules(self):
        calculador = PRICING_CALCULATORS.get(self.category, PricingStrategy())
        self.price = calculador.calculate_final_price(self.price)
