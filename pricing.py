class PricingStrategy:
    IVA = 21
    def calculate_final_price(self, base_price: float) -> float:

        return base_price

class TecnhologyPricing(PricingStrategy):
    def calculate_final_price(self, base_price: float) -> float:
            
            return base_price+(base_price * self.IVA / 100)

class SportsPricing(PricingStrategy):
    def calculate_final_price(self, base_price: float) -> float:
            return 0 if base_price <= 10 else base_price - 10


# Este diccionario asocia el nombre de la categoría (string) con la CLASE correspondiente.
PRICING_CALCULATORS = {
    "Tecnologia": TecnhologyPricing(),
    "Deporte": SportsPricing(),
    "General": PricingStrategy() # La clase padre, que no altera el precio
}