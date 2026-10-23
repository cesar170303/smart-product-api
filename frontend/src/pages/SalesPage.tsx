import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, updateOrderStatus } from '../api/client';
import type { ProductStatus } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import BackToListing from '../components/BackToListing';
import PageShell from '../components/PageShell';
import SaleRow, { type OrderAction } from '../components/SaleRow';
import StatusTag from '../components/StatusTag';
import { PRIMARY_BUTTON } from '../components/styles';
import { useSales } from '../hooks/useSales';
import { formatPrice } from '../utils/format';
import { loginPath } from '../utils/routes';
import { groupSales, type SaleItem } from '../utils/sales';

const HTTP_UNAUTHORIZED = 401;
const SKELETON_ROWS = 3;
const COLUMN_LABEL: Record<ProductStatus, string> = {
  available: 'en venta',
  reserved: 'pendientes de envío',
  sold: 'vendidos',
};

interface ColumnProps {
  status: ProductStatus;
  items: SaleItem[];
  // frase del hueco cuando no hay nada en esta columna
  empty: string;
  // dato extra junto al recuento (por ejemplo, lo cobrado en la columna de vendidos)
  extra?: string;
  highlighted: Set<number>;
  onSeen: (productId: number) => void;
  onChangeOrder: (orderId: number, action: OrderAction) => Promise<void>;
}

function Column({ status, items, empty, extra, highlighted, onSeen, onChangeOrder }: ColumnProps) {
  return (
    <section aria-label={`Artículos ${COLUMN_LABEL[status]}`}>
      <header className="flex items-center gap-3 border-b-[1.5px] border-ink-faint/50 pb-3">
        <StatusTag status={status} />
        <span className="font-display text-2xl font-extrabold [font-variant-numeric:tabular-nums]">{items.length}</span>
        {extra && <span className="ml-auto text-[15px] text-ink-dim">{extra}</span>}
      </header>

      {items.length === 0 ? (
        <p className="py-6 text-ink-faint">{empty}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <SaleRow
              key={item.product.id}
              item={item}
              highlighted={highlighted.has(item.product.id)}
              onSeen={() => onSeen(item.product.id)}
              onChangeOrder={onChangeOrder}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default function SalesPage() {
  const { token, userId, logout } = useAuth();
  const navigate = useNavigate();
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());

  const expired = () => {
    logout();
    navigate(loginPath('/mis-ventas'), { replace: true });
  };
  // RequireAuth garantiza la sesión; el valor vacío solo evita tratar token como posiblemente nulo
  const { state, reload, applyOrder } = useSales(token ?? '', userId ?? 0, expired);

  const sales = useMemo(
    () => (state.status === 'ready' && userId !== null ? groupSales(state.products, state.orders, userId) : null),
    [state, userId],
  );

  const changeOrder = async (orderId: number, action: OrderAction) => {
    if (!token) return;
    try {
      const updated = await updateOrderStatus(orderId, action, token);
      applyOrder(updated);
      // El artículo que acaba de cambiar de columna se queda marcado hasta que lo ves
      setHighlighted((current) => new Set(current).add(updated.product.id));
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) {
        expired();
        return;
      }
      throw caught;
    }
  };

  const markSeen = (productId: number) => {
    setHighlighted((current) => {
      if (!current.has(productId)) return current;
      const next = new Set(current);
      next.delete(productId);
      return next;
    });
  };

  const total = sales ? sales.available.length + sales.pending.length + sales.sold.length : 0;

  return (
    <PageShell search={<BackToListing />}>
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-[40px] leading-tight font-extrabold tracking-[-0.02em]">Mis ventas</h1>
            {sales && sales.sold.length > 0 && (
              <p className="mt-1 text-lg text-ink-dim">
                Has vendido {sales.sold.length} {sales.sold.length === 1 ? 'artículo' : 'artículos'} por {formatPrice(sales.soldTotal)}.
              </p>
            )}
          </div>
        </div>

        {state.status === 'loading' && (
          <div aria-busy="true" className="grid grid-cols-3 gap-10">
            <p role="status" className="sr-only">
              Cargando tus ventas…
            </p>
            {[0, 1, 2].map((column) => (
              <div key={column} aria-hidden="true" className="flex flex-col gap-4">
                <div className="h-9 rounded-lg bg-sheet-high motion-safe:animate-pulse" />
                {Array.from({ length: SKELETON_ROWS }, (_, row) => (
                  <div key={row} className="h-[88px] rounded-xl bg-sheet motion-safe:animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <div role="alert" className="max-w-xl rounded-2xl border-[1.5px] border-line bg-sheet p-6">
            <p className="font-display text-2xl font-extrabold">No hemos podido cargar tus ventas</p>
            <p className="mt-2 text-ink-dim">{state.message}</p>
            <button type="button" onClick={reload} className={`mt-5 h-11 px-5 ${PRIMARY_BUTTON}`}>
              Reintentar
            </button>
          </div>
        )}

        {sales && total === 0 && (
          <div className="max-w-xl rounded-2xl border-[1.5px] border-dashed border-line p-6">
            <p className="font-display text-2xl font-extrabold">Todavía no has subido nada</p>
            <p className="mt-2 text-ink-dim">Sube tu primer producto y lo verás aquí, con su estado.</p>
            <Link to="/subir" className={`mt-5 h-12 px-6 ${PRIMARY_BUTTON}`}>
              + Subir producto
            </Link>
          </div>
        )}

        {sales && total > 0 && (
          <div className="grid grid-cols-3 items-start gap-10">
            <Column
              status="available"
              items={sales.available}
              empty="No tienes nada a la venta ahora mismo."
              highlighted={highlighted}
              onSeen={markSeen}
              onChangeOrder={changeOrder}
            />
            <Column
              status="reserved"
              items={sales.pending}
              empty="Ningún pedido pendiente de envío."
              highlighted={highlighted}
              onSeen={markSeen}
              onChangeOrder={changeOrder}
            />
            <Column
              status="sold"
              items={sales.sold}
              empty="Todavía no has vendido nada."
              extra={sales.sold.length > 0 ? formatPrice(sales.soldTotal) : undefined}
              highlighted={highlighted}
              onSeen={markSeen}
              onChangeOrder={changeOrder}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}
