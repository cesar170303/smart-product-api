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
  // true cuando una consulta completa del historial ya tuvo éxito. No se deduce de lastId: enviar un mensaje
  // también lo adelanta, y una conversación vacía tiene lastId a 0 aunque esté cargada.
  const loadedOnce = useRef(false);

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
        // Hasta cargar el historial entero se pide desde el principio, aunque un envío ya haya adelantado lastId:
        // si no, los mensajes anteriores no aparecerían nunca
        const afterId = loadedOnce.current ? lastId.current : 0;
        merge(await getMessages(productId, token, { buyerId, afterId, signal }));
        loadedOnce.current = true;
        setStatus('ready');
        setOffline(false);
      } catch (caught) {
        if (signal.aborted) return;
        if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) {
          onUnauthorized();
          return;
        }
        // Si la conversación ya se cargó (aunque esté vacía), un fallo suelto no la tapa: solo avisa y sigue intentando
        if (loadedOnce.current) {
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
    loadedOnce.current = false;
    setStatus('loading');
    setAttempt((current) => current + 1);
  }, []);

  // Envía un mensaje y lo añade al momento. Si falla, lanza el error para que el formulario conserve el texto.
  const send = useCallback(
    async (body: string) => {
      try {
        const sent = await sendMessage(productId, body, token, buyerId);
        // Enviar no cuenta como haber cargado el historial: eso lo decide solo una consulta completa
        merge([sent]);
      } catch (caught) {
        if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) onUnauthorized();
        throw caught;
      }
    },
    [productId, buyerId, token, merge, onUnauthorized],
  );

  return { messages, status, error, offline, retry, send };
}
