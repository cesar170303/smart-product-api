import { Fragment, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, imageSrc } from '../api/client';
import type { Product } from '../api/types';
import { useThread } from '../hooks/useThread';
import { formatClock, formatDayLabel, formatPrice } from '../utils/format';
import FormAlert from './FormAlert';
import { PRIMARY_BUTTON } from './styles';
import StatusTag from './StatusTag';

const MAX_LENGTH = 1000;
// a partir de cuántos caracteres se enseña el contador
const COUNTER_FROM = 900;
// margen en píxeles por debajo del cual se considera que estás leyendo lo último
const NEAR_BOTTOM = 80;

interface ChatThreadProps {
  product: Product;
  buyerId: number;
  userId: number;
  token: string;
  onUnauthorized: () => void;
}

export default function ChatThread({ product, buyerId, userId, token, onUnauthorized }: ChatThreadProps) {
  const { messages, status, error, offline, retry, send } = useThread({ productId: product.id, buyerId, token, onUnauthorized });
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // si estás leyendo lo último, los mensajes nuevos te llevan abajo; si has subido a releer, no te mueven
  const stickToBottom = useRef(true);

  const isSeller = userId === product.seller.id;
  const otherName = isSeller
    ? (messages.find((message) => message.sender_id === buyerId)?.sender.name ?? `Comprador nº ${buyerId}`)
    : product.seller.name;

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list && stickToBottom.current) list.scrollTop = list.scrollHeight;
  }, [messages.length, status]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setSendError('');
    try {
      await send(body);
      setDraft('');
      stickToBottom.current = true;
      inputRef.current?.focus();
    } catch (caught) {
      // El texto se conserva para poder reintentar
      setSendError(caught instanceof ApiError ? caught.message : 'No hemos podido enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Intro envía; Mayús+Intro hace salto de línea. No se envía mientras se compone con el teclado de un IME.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-4 border-b-[1.5px] border-line px-6 py-4">
        <Link to={`/producto/${product.id}`} aria-hidden="true" tabIndex={-1} className="block size-12 shrink-0 overflow-hidden rounded-xl bg-sheet-high">
          {product.image_url ? (
            <img src={imageSrc(product.image_url)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="halftone halftone-fine block h-full" />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl leading-6 font-extrabold">{otherName}</h2>
          <p className="truncate text-sm text-ink-dim">
            <Link to={`/producto/${product.id}`} className="font-semibold hover:text-violet-soft">
              {product.name}
            </Link>{' '}
            · {formatPrice(product.price)}
          </p>
        </div>
        <StatusTag status={product.status} />
      </header>

      <div
        ref={listRef}
        role="log"
        aria-label={`Mensajes con ${otherName}`}
        aria-live="polite"
        onScroll={(event) => {
          const list = event.currentTarget;
          stickToBottom.current = list.scrollHeight - list.scrollTop - list.clientHeight < NEAR_BOTTOM;
        }}
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-6 py-5"
      >
        {status === 'loading' && <p className="m-auto text-ink-faint">Cargando la conversación…</p>}

        {status === 'error' && (
          <div role="alert" className="m-auto max-w-sm text-center">
            <p className="text-ink-dim">{error}</p>
            <button type="button" onClick={retry} className={`mt-4 h-11 px-5 ${PRIMARY_BUTTON}`}>
              Reintentar
            </button>
          </div>
        )}

        {status === 'ready' && messages.length === 0 && (
          <p className="m-auto max-w-xs text-center text-ink-dim">
            Todavía no hay mensajes. Escribe el primero a {otherName} sobre «{product.name}».
          </p>
        )}

        {messages.map((message, index) => {
          const mine = message.sender_id === userId;
          const day = formatDayLabel(message.created_at);
          const newDay = index === 0 || day !== formatDayLabel(messages[index - 1].created_at);
          return (
            <Fragment key={message.id}>
              {newDay && <p className="my-3 text-center text-xs font-semibold tracking-wide text-ink-faint uppercase">{day}</p>}
              <div className={`flex max-w-[72%] flex-col gap-0.5 ${mine ? 'items-end self-end' : 'items-start self-start'}`}>
                <p
                  className={`rounded-2xl px-4 py-2.5 leading-6 break-words whitespace-pre-wrap ${
                    mine ? 'rounded-br-md bg-violet text-paper' : 'rounded-bl-md border-[1.5px] border-line bg-sheet-high text-ink'
                  }`}
                >
                  <span className="sr-only">{mine ? 'Tú: ' : `${message.sender.name}: `}</span>
                  {message.body}
                </p>
                <p className="px-1 text-xs text-ink-faint">{formatClock(message.created_at)}</p>
              </div>
            </Fragment>
          );
        })}
      </div>

      {offline && (
        <p role="status" className="border-t-[1.5px] border-amber px-6 py-2 text-sm text-amber">
          Sin conexión con el servidor. Seguimos intentándolo…
        </p>
      )}

      <form onSubmit={submit} className="flex flex-col gap-2 border-t-[1.5px] border-line px-6 py-4">
        {sendError && <FormAlert>{sendError}</FormAlert>}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="chat-message" className="sr-only">
              Escribe un mensaje a {otherName}
            </label>
            <textarea
              id="chat-message"
              ref={inputRef}
              rows={2}
              value={draft}
              maxLength={MAX_LENGTH}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribe un mensaje…"
              className="w-full resize-none rounded-[10px] border-[1.5px] border-ink-faint/60 bg-sheet px-4 py-3 leading-6 text-ink transition-colors duration-150 hover:border-ink-faint focus:border-violet"
            />
          </div>
          <button type="submit" disabled={sending || draft.trim().length === 0} className={`h-12 px-6 ${PRIMARY_BUTTON}`}>
            {sending ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
        <p className="flex justify-between text-xs text-ink-faint">
          <span>Intro envía · Mayús+Intro, nueva línea · se actualiza solo cada pocos segundos</span>
          {draft.length >= COUNTER_FROM && (
            <span className="[font-variant-numeric:tabular-nums]">
              {draft.length}/{MAX_LENGTH}
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
