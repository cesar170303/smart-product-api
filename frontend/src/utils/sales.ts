import type { Order, Product } from '../api/types';

export interface SaleItem {
  product: Product;
  // el pedido pendiente de este artículo (solo en "Pendiente de envío"); null si no se encontró
  order: Order | null;
}

export interface Sales {
  available: SaleItem[];
  pending: SaleItem[];
  sold: SaleItem[];
  // euros de los artículos ya vendidos
  soldTotal: number;
}

const newestFirst = (a: SaleItem, b: SaleItem) => Date.parse(b.product.created_at) - Date.parse(a.product.created_at);

// Reparte los anuncios de una persona en los tres estados del panel. `orders` puede incluir también
// sus compras (la API devuelve todos los pedidos donde participa): aquí solo cuentan los de sus propios artículos.
export function groupSales(products: Product[], orders: Order[], userId: number): Sales {
  const mine = products.filter((product) => product.seller.id === userId);

  const pendingByProduct = new Map<number, Order>();
  for (const order of orders) {
    if (order.status !== 'pending' || order.product.seller.id !== userId) continue;
    const known = pendingByProduct.get(order.product.id);
    if (!known || Date.parse(order.created_at) > Date.parse(known.created_at)) pendingByProduct.set(order.product.id, order);
  }

  const toItems = (status: Product['status']): SaleItem[] =>
    mine
      .filter((product) => product.status === status)
      .map((product) => ({ product, order: pendingByProduct.get(product.id) ?? null }))
      .sort(newestFirst);

  const sold = toItems('sold');
  return {
    available: toItems('available'),
    pending: toItems('reserved'),
    sold,
    soldTotal: sold.reduce((sum, item) => sum + item.product.price, 0),
  };
}
