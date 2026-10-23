import { useState } from 'react';
import { ApiError, getConversations } from '../api/client';
import type { Conversation } from '../api/types';
import { usePolling } from './usePolling';

// La bandeja se refresca más despacio que una conversación abierta
export const INBOX_POLL_MS = 8000;

const NETWORK_ERROR = 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
const HTTP_UNAUTHORIZED = 401;

export type InboxState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; conversations: Conversation[] };

export function useConversations(token: string, onUnauthorized: () => void) {
  const [state, setState] = useState<InboxState>({ status: 'loading' });

  usePolling(
    async (signal) => {
      try {
        const conversations = await getConversations(token, signal);
        setState({ status: 'ready', conversations });
      } catch (caught) {
        if (signal.aborted) return;
        if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) {
          onUnauthorized();
          return;
        }
        // Si ya había bandeja, un fallo suelto no la borra
        setState((current) =>
          current.status === 'ready'
            ? current
            : { status: 'error', message: caught instanceof ApiError ? caught.message : NETWORK_ERROR },
        );
      }
    },
    INBOX_POLL_MS,
    [token],
  );

  return state;
}
