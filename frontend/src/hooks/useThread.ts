import { useCallback, useRef, useState } from 'react';
import { ApiError, getMessages, sendMessage } from '../api/client';
import type { Message } from '../api/types';
import { usePolling } from './usePolling';

// Cada cuántos milisegundos se piden los mensajes nuevos (el tiempo real con WebSockets llegará más adelante)
export const THREAD_POLL_MS = 3000;

const NETWORK_ERROR = 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
const HTTP_UNAUTHORIZED = 401;

type ThreadStatus = 'loading' | 'ready' | 'error';

interface UseThreadOptions {
  productId: number;
  // comprador de la conversación; para un comprador es él mismo y el backend lo ignora, para el vendedor es obligatorio
  buyerId: number;
  token: string;
  onUnauthorized: () => void;
}

// Mensajes de una conversación: carga inicial, refresco periódico solo con las novedades y envío.
export function useThread({ productId, buyerId, token, onUnauthorized }: UseThreadOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ThreadStatus>('loading');
  const [error, setError] = useState('');
  // la última consulta falló pero ya había mensajes en pantalla: se sigue intentando
  const [offline, setOffline] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const lastId = useRef(0);

  const merge = useCallback((incoming: Message[]) => {
    if (incoming.length === 0) return;
    lastId.current = Math.max(lastId.current, ...incoming.map((message) => message.id));
    setMessages((current) => {
      const known = new Set(current.map((message) => message.id));
      const fresh = incoming.filter((message) => !known.has(message.id));
      return fresh.length === 0 ? current : [...current, ...fresh].sort((a, b) => a.id - b.id);
    });
  }, []);

  usePolling(
    async (signal) => {
      try {
        merge(await getMessages(productId, token, { buyerId, afterId: lastId.current, signal }));
        setStatus('ready');
        setOffline(false);
      } catch (caught) {
        if (signal.aborted) return;
        if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) {
          onUnauthorized();
          return;
        }
        // Si ya había conversación en pantalla, un fallo suelto no la tapa: solo avisa y sigue intentando
        if (lastId.current > 0) {
          setOffline(true);
        } else {
          setStatus('error');
          setError(caught instanceof ApiError ? caught.message : NETWORK_ERROR);
        }
      }
    },
    THREAD_POLL_MS,
    [productId, buyerId, token, attempt],
  );

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((current) => current + 1);
  }, []);

  // Envía un mensaje y lo añade al momento. Si falla, lanza el error para que el formulario conserve el texto.
  const send = useCallback(
    async (body: string) => {
      try {
        const sent = await sendMessage(productId, body, token, buyerId);
        merge([sent]);
        setStatus('ready');
      } catch (caught) {
        if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) onUnauthorized();
        throw caught;
      }
    },
    [productId, buyerId, token, merge, onUnauthorized],
  );

  return { messages, status, error, offline, retry, send };
}
