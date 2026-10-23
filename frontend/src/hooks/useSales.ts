import { useCallback, useEffect, useState } from 'react';
import { ApiError, getOrders, getProducts } from '../api/client';
import type { Order, Product } from '../api/types';

type SalesState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; products: Product[]; orders: Order[] };

const NETWORK_ERROR = 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
const HTTP_UNAUTHORIZED = 401;

// Carga los anuncios (solo los suyos) y los pedidos de quien tiene sesión. `onUnauthorized` se llama si la sesión caducó.
export function useSales(token: string, userId: number, onUnauthorized: () => void) {
  const [state, setState] = useState<SalesState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([getProducts({ sellerId: userId, signal: controller.signal }), getOrders(token, controller.signal)])
      .then(([products, orders]) => setState({ status: 'ready', products, orders }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof ApiError && error.status === HTTP_UNAUTHORIZED) {
          onUnauthorized();
          return;
        }
        setState({ status: 'error', message: error instanceof ApiError ? error.message : NETWORK_ERROR });
      });

    return () => controller.abort();
    // onUnauthorized cambia en cada render del padre; solo importa al cargar o reintentar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId, attempt]);

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((current) => current + 1);
  }, []);

  // Tras cambiar un pedido, la API devuelve el pedido con su producto ya actualizado: se sustituyen los dos
  const applyOrder = useCallback((updated: Order) => {
    setState((current) => {
      if (current.status !== 'ready') return current;
      return {
        status: 'ready',
        products: current.products.map((product) => (product.id === updated.product.id ? updated.product : product)),
        orders: current.orders.map((order) => (order.id === updated.id ? updated : order)),
      };
    });
  }, []);

  return { state, reload, applyOrder };
}
