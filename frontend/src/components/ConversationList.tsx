import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imageSrc } from '../api/client';
import type { Conversation } from '../api/types';
import type { InboxState } from '../hooks/useConversations';
import { conversationKey, conversationPath } from '../utils/chat';
import { formatRelativeDate } from '../utils/format';

const SKELETON_ROWS = 4;

interface ConversationListProps {
  inbox: InboxState;
  userId: number;
  // conversación abierta, con la forma "productId-buyerId"
  activeKey: string | null;
}

function Thumb({ conversation }: { conversation: Conversation }) {
  const [failed, setFailed] = useState(false);
  const { product } = conversation;
  return (
    <span aria-hidden="true" className="block size-14 shrink-0 overflow-hidden rounded-xl bg-sheet-high">
      {failed || !product.image_url ? (
        <span className="halftone halftone-fine block h-full" />
      ) : (
        <img src={imageSrc(product.image_url)} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      )}
    </span>
  );
}

export default function ConversationList({ inbox, userId, activeKey }: ConversationListProps) {
  if (inbox.status === 'loading') {
    return (
      <div aria-busy="true" className="flex flex-col gap-3 p-4">
        <p role="status" className="sr-only">
          Cargando tus conversaciones…
        </p>
        {Array.from({ length: SKELETON_ROWS }, (_, row) => (
          <div key={row} aria-hidden="true" className="h-[72px] rounded-xl bg-sheet-high motion-safe:animate-pulse" />
        ))}
      </div>
    );
  }

  if (inbox.status === 'error') {
    return (
      <p role="alert" className="m-4 rounded-lg border-[1.5px] border-amber px-4 py-3 text-[15px] text-amber">
        {inbox.message}
      </p>
    );
  }

  if (inbox.conversations.length === 0) {
    return (
      <div className="p-6">
        <p className="font-display text-xl font-extrabold">Todavía no tienes conversaciones</p>
        <p className="mt-2 text-ink-dim">
          Abre un anuncio y pulsa «Chatear con el vendedor». Cuando alguien te escriba por uno de los tuyos, aparecerá aquí.
        </p>
        <Link to="/" className="mt-4 inline-block font-semibold text-violet-soft underline underline-offset-4 hover:text-ink">
          Ver anuncios
        </Link>
      </div>
    );
  }

  return (
    <ul>
      {inbox.conversations.map((conversation) => {
        const key = conversationKey(conversation.product.id, conversation.buyer_id);
        const active = key === activeKey;
        const { last_message: last } = conversation;
        const mine = last.sender_id === userId;
        return (
          <li key={key}>
            <Link
              to={conversationPath(conversation, userId)}
              aria-current={active ? 'page' : undefined}
              className={`flex gap-3 border-b-[1.5px] border-line px-4 py-3.5 transition-colors duration-150 hover:bg-sheet-high ${active ? 'bg-sheet-high' : ''}`}
            >
              <Thumb conversation={conversation} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-semibold text-ink">{conversation.other.name}</span>
                  <span className="shrink-0 text-xs text-ink-faint">{formatRelativeDate(last.created_at)}</span>
                </span>
                <span className="truncate text-sm text-ink-dim">{conversation.product.name}</span>
                <span className="truncate text-sm text-ink-faint">
                  {mine && 'Tú: '}
                  {last.body}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
