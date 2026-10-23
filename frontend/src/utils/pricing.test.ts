import { describe, expect, it } from 'vitest';
import { priceRuleFor } from './pricing';

describe('priceRuleFor', () => {
  it.each([
    ['Tecnología', 100, 121],
    ['tecnologia', 100, 121],
    ['Deporte', 100, 90],
    ['Ofertas', 20, 15],
    ['Ofertas', 5, 1],
    ['Premium', 80, 100],
  ])('%s: %s € -> %s €', (category, price, expected) => {
    expect(priceRuleFor(category)?.apply(price)).toBe(expected);
  });

  it.each(['Hogar', 'General', '', 'Moda'])('"%s" no cambia el precio', (category) => {
    expect(priceRuleFor(category)).toBeNull();
  });
});
