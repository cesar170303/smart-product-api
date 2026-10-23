import { useEffect, useState } from 'react';
import { ApiError, getProducts } from '../api/client';
import type { Product } from '../api/types';

type ProductsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; products: Product[] };

// Carga el listado público. `retry` vuelve a pedirlo tras un error.
export function useProducts() {
  const [state, setState] = useState<ProductsState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Si el componente se desmonta (o se reintenta) antes de que llegue la respuesta, se cancela la petición
    const controller = new AbortController();

    getProducts(controller.signal)
      .then((products) => setState({ status: 'ready', products }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        // Un ApiError ya trae el mensaje en español de la API; cualquier otro fallo es de red
        const message =
          error instanceof ApiError
            ? error.message
            : 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
        setState({ status: 'error', message });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = () => {
    setState({ status: 'loading' });
    setAttempt((current) => current + 1);
  };

  return { state, retry };
}
