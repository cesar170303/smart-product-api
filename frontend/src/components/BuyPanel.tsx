import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, createOrder } from '../api/client';
import type { Product } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { formatPrice } from '../utils/format';
import { loginPath } from '../utils/routes';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './styles';

const HTTP_UNAUTHORIZED = 401;
const HTTP_CONFLICT = 409;

type Step = 'idle' | 'confirming' | 'sending' | 'done';

interface BuyPanelProps {
  product: Product;
  // el anuncio ya viene actualizado del pedido ("Pendiente de envío")
  onPurchased: (product: Product) => void;
  // alguien se nos adelantó: hay que volver a pedir el anuncio para mostrar su estado real
  onStale: () => void;
}

export default function BuyPanel({ product, onPurchased, onStale }: BuyPanelProps) {
  const { token, userId, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState('');

  const loginHere = loginPath(`/producto/${product.id}`);
  const isOwner = userId !== null && userId === product.seller.id;
  const price = formatPrice(product.price);

  const startBuying = () => {
    // Comprar pide cuenta: se pasa por el login y se vuelve a esta ficha
    if (!isAuthenticated) {
      navigate(loginHere);
      return;
    }
    setError('');
    setStep('confirming');
  };

  const confirm = async () => {
    if (!token) return;
    setStep('sending');
    setError('');
    try {
      const order = await createOrder(product.id, token);
      onPurchased(order.product);
      setStep('done');
    } catch (caught) {
      setStep('idle');
      if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) {
        // La sesión caducó mientras mirabas el anuncio
        logout();
        navigate(loginHere);
        return;
      }
      setError(caught instanceof Error ? caught.message : 'No hemos podido registrar la compra.');
      if (caught instanceof ApiError && caught.status === HTTP_CONFLICT) onStale();
    }
  };

  const openChat = () => {
    const chat = `/chat/${product.id}`;
    navigate(isAuthenticated ? chat : loginPath(chat));
  };

  if (isOwner) {
    return (
      <div className="rounded-xl border-[1.5px] border-dashed border-line p-5">
        <p className="font-display text-xl font-extrabold">Este anuncio es tuyo</p>
        <p className="mt-1 text-ink-dim">Los pedidos de tus artículos se gestionan desde Mis ventas.</p>
        <Link to="/mis-ventas" className="mt-3 inline-block font-semibold text-violet-soft underline underline-offset-4 hover:text-ink">
          Ir a Mis ventas
        </Link>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div role="status" className="rounded-xl border-[1.5px] border-violet bg-sheet-high p-5">
        <p className="font-display text-xl font-extrabold">Compra registrada</p>
        <p className="mt-1 text-ink-dim">
          El anuncio pasa a «Pendiente de envío». Habla con el vendedor para acordar el envío o la entrega.
        </p>
        <button type="button" onClick={openChat} className={`mt-4 h-12 px-5 ${SECONDARY_BUTTON}`}>
          Chatear con el vendedor
        </button>
      </div>
    );
  }

  const isAvailable = product.status === 'available';

  return (
    <div className="flex flex-col gap-4">
      {isAvailable && step === 'idle' && (
        <button type="button" onClick={startBuying} className={`h-14 w-full text-lg ${PRIMARY_BUTTON}`}>
          Comprar por {price}
        </button>
      )}

      {isAvailable && step !== 'idle' && (
        <div className="rounded-xl border-[1.5px] border-violet bg-sheet-high p-5">
          <p className="font-display text-xl font-extrabold">¿Confirmas la compra?</p>
          <p className="mt-1 text-ink-dim">
            Vas a comprar «{product.name}» por {price}. El anuncio pasará a «Pendiente de envío».
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={confirm}
              disabled={step === 'sending'}
              className={`h-12 flex-1 ${PRIMARY_BUTTON}`}
            >
              {step === 'sending' ? 'Registrando…' : 'Confirmar compra'}
            </button>
            <button
              type="button"
              onClick={() => setStep('idle')}
              disabled={step === 'sending'}
              className={`h-12 px-5 ${SECONDARY_BUTTON}`}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!isAvailable && (
        <div role="status" className="rounded-xl border-[1.5px] border-dashed border-line p-5">
          <p className="font-display text-xl font-extrabold">
            {product.status === 'reserved' ? 'Ya está reservado' : 'Este artículo ya se vendió'}
          </p>
          <p className="mt-1 text-ink-dim">
            {product.status === 'reserved'
              ? 'Otra persona lo ha comprado y está pendiente de envío. Si el pedido se cancela, volverá a estar en venta.'
              : 'No se puede comprar. Mira más artículos de la misma categoría.'}
          </p>
          <Link
            to={`/?categoria=${encodeURIComponent(product.category.name)}`}
            className="mt-3 inline-block font-semibold text-violet-soft underline underline-offset-4 hover:text-ink"
          >
            Ver más en {product.category.name}
          </Link>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg border-[1.5px] border-amber px-4 py-3 text-amber">
          {error}
        </p>
      )}

      {product.status !== 'sold' && step === 'idle' && (
        <button type="button" onClick={openChat} className={`h-14 w-full ${SECONDARY_BUTTON}`}>
          Chatear con el vendedor
        </button>
      )}
    </div>
  );
}
