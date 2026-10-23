import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import BackToListing from '../components/BackToListing';
import ChatThread from '../components/ChatThread';
import ConversationList from '../components/ConversationList';
import PageShell from '../components/PageShell';
import { useConversations } from '../hooks/useConversations';
import { useProduct } from '../hooks/useProduct';
import { conversationKey } from '../utils/chat';
import { loginPath } from '../utils/routes';

interface PaneProps {
  productId: number;
  // solo el vendedor lo indica (?comprador=...): con qué comprador habla
  buyerParam: number | null;
  userId: number;
  token: string;
  onUnauthorized: () => void;
}

const PLACEHOLDER = 'flex h-full flex-col items-center justify-center gap-2 p-10 text-center';

function EmptyPane({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className={PLACEHOLDER}>
      <p className="font-display text-2xl font-extrabold">{title}</p>
      {children && <p className="max-w-sm text-ink-dim">{children}</p>}
    </div>
  );
}

// Panel derecho cuando hay un producto en la dirección: carga el producto para saber quién vende y con quién se habla
function ThreadPane({ productId, buyerParam, userId, token, onUnauthorized }: PaneProps) {
  const { state, reload } = useProduct(productId);

  if (state.status === 'loading') return <EmptyPane title="Cargando…" />;

  if (state.status === 'not-found') {
    return (
      <EmptyPane title="Este anuncio no existe">
        Puede que lo hayan retirado. Elige otra conversación de la lista.
      </EmptyPane>
    );
  }

  if (state.status === 'error') {
    return (
      <div className={PLACEHOLDER}>
        <p role="alert" className="max-w-sm text-ink-dim">
          {state.message}
        </p>
        <button type="button" onClick={reload} className="font-semibold text-violet-soft underline underline-offset-4 hover:text-ink">
          Reintentar
        </button>
      </div>
    );
  }

  const { product } = state;
  const isSeller = userId === product.seller.id;

  // El vendedor llega sin indicar comprador (por ejemplo, desde el anuncio): que elija en la lista
  if (isSeller && buyerParam === null) {
    return <EmptyPane title="Este anuncio es tuyo">Elige en la lista la conversación con la persona a la que quieres contestar.</EmptyPane>;
  }

  return (
    <ChatThread
      key={conversationKey(product.id, isSeller ? (buyerParam as number) : userId)}
      product={product}
      buyerId={isSeller ? (buyerParam as number) : userId}
      userId={userId}
      token={token}
      onUnauthorized={onUnauthorized}
    />
  );
}

export default function ChatPage() {
  const { token, userId, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [search] = useSearchParams();

  const productId = params.productId ? Number(params.productId) : null;
  const rawBuyer = search.get('comprador');
  const buyerParam = rawBuyer !== null && Number.isInteger(Number(rawBuyer)) ? Number(rawBuyer) : null;

  const onUnauthorized = () => {
    logout();
    navigate(loginPath(location.pathname + location.search), { replace: true });
  };

  // RequireAuth garantiza la sesión; estos valores por defecto solo contentan al tipado
  const inbox = useConversations(token ?? '', onUnauthorized);
  if (token === null || userId === null) return null;

  // La conversación abierta se marca en la lista: la propia para un comprador; la del comprador indicado, para el vendedor
  const activeKey = productId !== null ? conversationKey(productId, buyerParam ?? userId) : null;

  return (
    <PageShell search={<BackToListing />}>
      <h1 className="sr-only">Mensajes</h1>
      <div className="grid h-[calc(100vh-200px)] min-h-[560px] grid-cols-[minmax(300px,380px)_minmax(0,1fr)] overflow-hidden rounded-2xl border-[1.5px] border-line bg-sheet">
        <section aria-label="Conversaciones" className="flex min-h-0 flex-col border-r-[1.5px] border-line">
          <h2 className="border-b-[1.5px] border-line px-4 py-4 font-display text-2xl font-extrabold">Mensajes</h2>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ConversationList inbox={inbox} userId={userId} activeKey={activeKey} />
          </div>
        </section>

        <section aria-label="Conversación" className="min-h-0 min-w-0">
          {productId !== null && Number.isInteger(productId) ? (
            <ThreadPane productId={productId} buyerParam={buyerParam} userId={userId} token={token} onUnauthorized={onUnauthorized} />
          ) : (
            <EmptyPane title="Elige una conversación">
              Aquí hablas con quien compra o vende un artículo. Para empezar una nueva, abre un anuncio y pulsa «Chatear».
            </EmptyPane>
          )}
        </section>
      </div>
    </PageShell>
  );
}
