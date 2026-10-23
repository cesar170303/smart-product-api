import { normalize } from './format';

// Espejo de backend/services/pricing.py: el backend recalcula el precio al publicar según la categoría.
// Esto solo sirve para AVISAR antes de publicar; el precio real es el que devuelve la API.
export interface PriceRule {
  label: string;
  apply: (price: number) => number;
}

const roundCents = (value: number) => Math.round(value * 100) / 100;

const MIN_AFTER_DISCOUNT = 1;
const FIXED_DISCOUNT = 5;

// Claves normalizadas (minúsculas y sin acentos), igual que en el backend
const RULES: Record<string, PriceRule> = {
  tecnologia: { label: '+21 % de IVA', apply: (price) => roundCents(price * 1.21) },
  deporte: { label: '−10 %', apply: (price) => roundCents(price * 0.9) },
  ofertas: { label: '−5 € (mínimo 1 €)', apply: (price) => roundCents(Math.max(price - FIXED_DISCOUNT, MIN_AFTER_DISCOUNT)) },
  premium: { label: '+25 %', apply: (price) => roundCents(price * 1.25) },
};

// Regla de precio de una categoría, o null si no cambia el precio
export function priceRuleFor(category: string): PriceRule | null {
  return RULES[normalize(category)] ?? null;
}
