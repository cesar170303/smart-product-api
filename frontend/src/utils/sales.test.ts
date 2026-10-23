import { describe, expect, it } from 'vitest';
import type { Order, Product } from '../api/types';
import { exampleProduct } from '../testUtils';
import { groupSales } from './sales';

const ME = 2;
const product = (id: number, status: Product['status'], overrides: Partial<Product> = {}): Product => ({
  ...exampleProduct,
  id,
  status,
  ...overrides,
});
const order = (id: number, target: Product, overrides: Partial<Order> = {}): Order => ({
  id,
  buyer_id: 5,
  status: 'pending',
  created_at: '2026-10-22T10:00:00Z',
  product: target,
  ...overrides,
});

describe('groupSales', () => {
  it('reparte mis anuncios por estado y deja fuera los de otras personas', () => {
    const products = [
      product(1, 'available'),
      product(2, 'reserved'),
      product(3, 'sold', { price: 35 }),
      product(4, 'sold', { price: 80 }),
      product(5, 'available', { seller: { id: 9, name: 'Otra', location: null } }),
    ];

    const sales = groupSales(products, [], ME);

    expect(sales.available.map((item) => item.product.id)).toEqual([1]);
    expect(sales.pending.map((item) => item.product.id)).toEqual([2]);
    expect(sales.sold.map((item) => item.product.id)).toEqual([3, 4]);
    expect(sales.soldTotal).toBe(115);
  });

  it('asocia el pedido pendiente a su artículo reservado', () => {
    const reserved = product(2, 'reserved');

    const sales = groupSales([reserved], [order(11, reserved)], ME);

    expect(sales.pending[0].order?.id).toBe(11);
  });

  it('ignora mis compras, los pedidos ya cerrados y los de otros vendedores', () => {
    const reserved = product(2, 'reserved');
    const others = product(8, 'reserved', { seller: { id: 9, name: 'Otra', location: null } });
    const orders = [
      order(11, reserved, { status: 'completed' }),
      order(12, reserved, { status: 'cancelled' }),
      order(13, others),
    ];

    const sales = groupSales([reserved, others], orders, ME);

    expect(sales.pending).toHaveLength(1);
    expect(sales.pending[0].order).toBeNull();
  });

  it('si hay varios pedidos pendientes del mismo artículo, usa el más reciente', () => {
    const reserved = product(2, 'reserved');
    const orders = [order(11, reserved, { created_at: '2026-10-20T10:00:00Z' }), order(12, reserved, { created_at: '2026-10-22T10:00:00Z' })];

    expect(groupSales([reserved], orders, ME).pending[0].order?.id).toBe(12);
  });

  it('ordena cada columna del más nuevo al más antiguo', () => {
    const products = [
      product(1, 'available', { created_at: '2026-10-01T10:00:00Z' }),
      product(2, 'available', { created_at: '2026-10-10T10:00:00Z' }),
    ];

    expect(groupSales(products, [], ME).available.map((item) => item.product.id)).toEqual([2, 1]);
  });

  it('sin anuncios, todo vacío y total a cero', () => {
    expect(groupSales([], [], ME)).toEqual({ available: [], pending: [], sold: [], soldTotal: 0 });
  });
});
