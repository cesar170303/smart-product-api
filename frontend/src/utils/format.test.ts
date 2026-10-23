import { describe, expect, it } from 'vitest';
import { formatPrice, formatRelativeDate, normalize } from './format';

describe('formatRelativeDate', () => {
  const now = Date.UTC(2026, 9, 23, 12, 0, 0);

  it.each([
    ['2026-10-20T12:00:00Z', 'hace 3 días'],
    ['2026-10-21T12:00:00Z', 'anteayer'],
    ['2026-10-22T12:00:00Z', 'ayer'],
    ['2026-10-23T09:00:00Z', 'hace 3 horas'],
    ['2026-10-23T11:59:50Z', 'hace un momento'],
    ['2026-10-02T12:00:00Z', 'hace 3 semanas'],
  ])('%s -> %s', (iso, expected) => {
    expect(formatRelativeDate(iso, now)).toBe(expected);
  });
});

describe('formatPrice', () => {
  it('quita los decimales a los precios enteros', () => {
    expect(formatPrice(120).replace(/\s/g, ' ')).toBe('120 €');
  });

  it('mantiene dos decimales si el precio los tiene', () => {
    expect(formatPrice(12.5).replace(/\s/g, ' ')).toBe('12,50 €');
  });
});

describe('normalize', () => {
  it('ignora acentos y mayúsculas para que "Cámara" y "camara" coincidan', () => {
    expect(normalize('  Cámara ANALÓGICA ')).toBe('camara analogica');
  });
});
