import { useCallback, useEffect, useState } from 'react';
import { ApiError, getProduct, getProducts } from '../api/client';
import type { Product } from '../api/types';

type ProductState =
  | { status: 'loading' }
  | { status: 'not-found'; message: string }
  | { status: 'error'; message: string }
  | { status: 'ready'; product: Product; sellerListings: number | null };

const NETWORK_ERROR = 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
const HTTP_NOT_FOUND = 404;

// Carga un anuncio y, de paso, cuántos anuncios tiene su vendedor (se piden solo los de esa persona).
// Si el recuento falla no pasa nada: la ficha se muestra igual, sin ese dato.
export function useProduct(id: number) {
  const [state, setState] = useState<ProductState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getProduct(id, controller.signal)
      .then(async (product) => {
        // Hace falta saber quién vende antes de contar sus anuncios
        const sellerListings = await getProducts({ sellerId: product.seller.id, signal: controller.signal })
          .then((listings) => listings.length)
          .catch(() => null);
        if (controller.signal.aborted) return;
        setState({ status: 'ready', product, sellerListings });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof ApiError && error.status === HTTP_NOT_FOUND) {
          setState({ status: 'not-found', message: error.message });
        } else {
          setState({ status: 'error', message: error instanceof ApiError ? error.message : NETWORK_ERROR });
        }
      });

    return () => controller.abort();
  }, [id, attempt]);

  // Vuelve a pedir el anuncio (tras un error o cuando alguien se nos adelantó comprándolo)
  const reload = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((current) => current + 1);
  }, []);

  // Sustituye el anuncio en pantalla sin volver a pedirlo (por ejemplo, tras comprarlo)
  const replaceProduct = useCallback((product: Product) => {
    setState((current) => (current.status === 'ready' ? { ...current, product } : current));
  }, []);

  return { state, reload, replaceProduct };
}
