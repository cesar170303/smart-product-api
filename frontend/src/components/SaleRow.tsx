import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imageSrc } from '../api/client';
import type { Product } from '../api/types';
import type { SaleItem } from '../utils/sales';
import { formatPrice, formatRelativeDate } from '../utils/format';
import { PRIMARY_BUTTON } from './styles';

export type OrderAction = 'completed' | 'cancelled';

interface SaleRowProps {
  item: SaleItem;
  // acaba de cambiar de estado: se queda marcado hasta que la persona lo ve
  highlighted: boolean;
  onSeen: () => void;
  // cambia el estado del pedido; lanza el error si falla, para mostrarlo en la fila
  onChangeOrder: (orderId: number, action: OrderAction) => Promise<void>;
}

const CONFIRM_TEXT: Record<OrderAction, string> = {
  completed: 'Pasará a «Vendido» y no se puede deshacer. Hazlo cuando ya lo hayas enviado o entregado.',
  cancelled: 'Se cancela el pedido y el anuncio vuelve a estar en venta. No se puede deshacer.',
};

const CONFIRM_BUTTON: Record<OrderAction, string> = {
  completed: 'Sí, marcar como vendido',
  cancelled: 'Sí, cancelar el pedido',
};

function Thumbnail({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  return (
    <Link to={`/producto/${product.id}`} tabIndex={-1} aria-hidden="true" className="block size-[88px] shrink-0 overflow-hidden rounded-xl bg-sheet-high">
      {failed || !product.image_url ? (
        <div className="halftone halftone-fine h-full" />
      ) : (
        <img src={imageSrc(product.image_url)} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      )}
    </Link>
  );
}

export default function SaleRow({ item, highlighted, onSeen, onChangeOrder }: SaleRowProps) {
  const { product, order } = item;
  const [asking, setAsking] = useState<OrderAction | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const isSold = product.status === 'sold';

  const confirm = async () => {
    if (!order || !asking) return;
    setSending(true);
    setError('');
    try {
      await onChangeOrder(order.id, asking);
      // Si todo va bien, el anuncio cambia de columna y esta fila se desmonta
    } catch (caught) {
      setSending(false);
      setAsking(null);
      setError(caught instanceof Error ? caught.message : 'No hemos podido cambiar el estado del pedido.');
    }
  };

  let meta = `Publicado ${formatRelativeDate(product.created_at)}`;
  if (product.status === 'reserved' && order) meta = `Pedido ${formatRelativeDate(order.created_at)} · comprador nº ${order.buyer_id}`;

  return (
    <li
      onPointerEnter={onSeen}
      onFocus={onSeen}
      className={`flex gap-4 border-b-[1.5px] border-line py-4 ${highlighted ? 'rounded-xl outline-2 -outline-offset-2 outline-violet px-3' : ''}`}
    >
      <Thumbnail product={product} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link to={`/producto/${product.id}`} className="line-clamp-2 leading-6 font-semibold text-ink hover:text-violet-soft">
          {product.name}
        </Link>
        <p
          className={`font-display text-2xl leading-8 font-extrabold [font-variant-numeric:tabular-nums] ${
            isSold ? 'text-ink-faint line-through decoration-2' : ''
          }`}
        >
          {formatPrice(product.price)}
        </p>
        <p className="text-sm text-ink-faint">{meta}</p>

        {product.status === 'reserved' && order && (
          <div className="mt-2 flex flex-col gap-3">
            {asking ? (
              <>
                <p className="text-[15px] text-ink-dim">{CONFIRM_TEXT[asking]}</p>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={confirm} disabled={sending} className={`h-10 px-4 text-[15px] ${PRIMARY_BUTTON}`}>
                    {sending ? 'Guardando…' : CONFIRM_BUTTON[asking]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAsking(null)}
                    disabled={sending}
                    className="text-[15px] font-semibold text-ink-faint hover:text-ink"
                  >
                    Volver
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <button type="button" onClick={() => setAsking('completed')} className={`h-10 px-4 text-[15px] ${PRIMARY_BUTTON}`}>
                  Marcar como vendido
                </button>
                <Link
                  to={`/chat/${product.id}?comprador=${order.buyer_id}`}
                  className="text-[15px] font-semibold text-violet-soft underline decoration-violet-deep decoration-2 underline-offset-4 hover:text-ink"
                >
                  Chatear con el comprador
                </Link>
                <button
                  type="button"
                  onClick={() => setAsking('cancelled')}
                  className="text-[15px] font-semibold text-ink-faint underline decoration-ink-faint/50 underline-offset-4 hover:text-ink"
                >
                  Cancelar pedido
                </button>
              </div>
            )}
          </div>
        )}

        {product.status === 'reserved' && !order && (
          <p className="text-sm text-ink-faint">No encontramos el pedido de este artículo. Recarga la página.</p>
        )}

        {error && (
          <p role="alert" className="text-[15px] text-amber">
            {error}
          </p>
        )}
      </div>
    </li>
  );
}
