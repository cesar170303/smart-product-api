import { describe, expect, it } from 'vitest';
import type { Conversation } from '../api/types';
import { exampleProduct } from '../testUtils';
import { conversationKey, conversationPath } from './chat';
import { formatClock, formatDayLabel } from './format';

const conversation = (buyerId: number): Conversation => ({
  product: { id: 7, name: 'iPhone', price: 290, image_url: '', status: 'available' },
  buyer_id: buyerId,
  other: { id: 2, name: 'Laura' },
  last_message: { id: 1, product_id: 7, buyer_id: buyerId, sender_id: 2, body: 'hola', created_at: exampleProduct.created_at, sender: { id: 2, name: 'Laura' } },
});

describe('conversationPath', () => {
  it('el comprador entra solo con el producto', () => {
    expect(conversationPath(conversation(5), 5)).toBe('/chat/7');
  });

  it('el vendedor indica con qué comprador habla', () => {
    expect(conversationPath(conversation(5), 2)).toBe('/chat/7?comprador=5');
  });
});

describe('conversationKey', () => {
  it('une producto y comprador', () => {
    expect(conversationKey(7, 5)).toBe('7-5');
  });
});

describe('formatDayLabel', () => {
  // Fechas locales: el día del calendario del usuario es lo que cuenta, no las zonas horarias del servidor
  const at = (year: number, month: number, day: number, hour = 12) => new Date(year, month - 1, day, hour).toISOString();
  const now = new Date(2026, 9, 23, 18).getTime();

  it('Hoy y Ayer', () => {
    expect(formatDayLabel(at(2026, 10, 23, 0), now)).toBe('Hoy');
    expect(formatDayLabel(at(2026, 10, 22, 23), now)).toBe('Ayer');
  });

  it('un día anterior, con día y mes', () => {
    expect(formatDayLabel(at(2026, 10, 12), now)).toMatch(/^12 oct/);
  });
});

describe('formatClock', () => {
  it('da la hora local con dos cifras', () => {
    expect(formatClock(new Date(2026, 9, 23, 9, 5).toISOString())).toBe('09:05');
  });
});
