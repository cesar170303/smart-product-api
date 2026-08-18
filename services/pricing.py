import unicodedata
from abc import ABC, abstractmethod


class PricingStrategy(ABC):
    """Estrategia base que define cómo calcular el precio final de un producto."""

    @abstractmethod
    def calculate_final_price(self, base_price: float) -> float:
        """Devuelve el precio final partiendo del precio base."""
        raise NotImplementedError


class StandardPricing(PricingStrategy):
    """Categoría general: no aplica ninguna variación al precio base."""

    def calculate_final_price(self, base_price: float) -> float:
        return base_price


class IvaPricing(PricingStrategy):
    """Aplica el IVA vigente sobre el precio base."""

    IVA_RATE = 0.21

    def calculate_final_price(self, base_price: float) -> float:
        return round(base_price * (1 + self.IVA_RATE), 2)


class PercentageDiscountPricing(PricingStrategy):
    """Aplica un descuento porcentual sobre el precio base (ej: rebajas)."""

    def __init__(self, discount_rate: float):
        if not 0 <= discount_rate <= 1:
            raise ValueError("discount_rate debe estar entre 0 y 1")
        self.discount_rate = discount_rate

    def calculate_final_price(self, base_price: float) -> float:
        return round(base_price * (1 - self.discount_rate), 2)


class FixedDiscountPricing(PricingStrategy):
    """Aplica un descuento fijo en euros sin bajar del precio mínimo."""

    def __init__(self, discount_amount: float, minimum_price: float = 0.0):
        if discount_amount < 0:
            raise ValueError("discount_amount no puede ser negativo")
        self.discount_amount = discount_amount
        self.minimum_price = minimum_price

    def calculate_final_price(self, base_price: float) -> float:
        return round(max(base_price - self.discount_amount, self.minimum_price), 2)


class PremiumPricing(PricingStrategy):
    """Aplica un margen premium (recargo porcentual) sobre el precio base."""

    def __init__(self, markup_rate: float):
        if markup_rate < 0:
            raise ValueError("markup_rate no puede ser negativo")
        self.markup_rate = markup_rate

    def calculate_final_price(self, base_price: float) -> float:
        return round(base_price * (1 + self.markup_rate), 2)


def normalize_category(category: str) -> str:
    """Normaliza la categoría a minúsculas y sin acentos para matcheos robustos."""
    normalized = unicodedata.normalize("NFKD", category)
    normalized = normalized.encode("ascii", "ignore").decode()
    return normalized.strip().lower()


def get_pricing_strategy(category: str | None) -> PricingStrategy:
    """Devuelve la estrategia asociada a la categoría, con fallback a StandardPricing."""
    if not category:
        return StandardPricing()
    return PRICING_CALCULATORS.get(normalize_category(category), StandardPricing())


# Cada categoría (ya normalizada) se asocia con su estrategia de precios.
PRICING_CALCULATORS = {
    "tecnologia": IvaPricing(),
    "deporte": PercentageDiscountPricing(discount_rate=0.10),
    "ofertas": FixedDiscountPricing(discount_amount=5.0, minimum_price=1.0),
    "premium": PremiumPricing(markup_rate=0.25),
    "general": StandardPricing(),
}
