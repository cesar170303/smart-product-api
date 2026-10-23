import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import type { Product } from '../api/types';
import BackToListing from '../components/BackToListing';
import BuyPanel from '../components/BuyPanel';
import FormAlert from '../components/FormAlert';
import PageShell from '../components/PageShell';
import ProductGallery from '../components/ProductGallery';
import SellerCard from '../components/SellerCard';
import StatusTag from '../components/StatusTag';
import { PRIMARY_BUTTON } from '../components/styles';
import { useProduct } from '../hooks/useProduct';
import { formatPrice, formatRelativeDate } from '../utils/format';
import { priceRuleFor } from '../utils/pricing';
import type { PublishedInfo } from '../utils/published';

const CENT = 0.005;

// Qué decir de un anuncio recién publicado: que ya está, qué categoría puso la IA y si el precio cambió por la regla
function publishedMessage(product: Product, published: PublishedInfo): string {
  const parts = ['Anuncio publicado.'];
  if (published.aiCategory) parts.push(`La IA le ha puesto la categoría «${product.category.name}».`);
  if (Math.abs(product.price - published.requestedPrice) > CENT) {
    const rule = priceRuleFor(product.category.name);
    parts.push(
      `El precio final es ${formatPrice(product.price)}: pediste ${formatPrice(published.requestedPrice)} y la categoría${
        rule ? ` aplica ${rule.label}` : ' cambia el precio'
      }.`,
    );
  }
  return parts.join(' ');
}

export default function ProductDetailPage() {
  const location = useLocation();
  // Si llegas justo después de publicar, el formulario deja aquí un aviso en el estado de la navegación
  const published = (location.state as { published?: PublishedInfo } | null)?.published;
  const params = useParams();
  const id = Number(params.id);
  const { state, reload, replaceProduct } = useProduct(id);

  // El título de la pestaña nombra el anuncio
  const title = state.status === 'ready' ? state.product.name : null;
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = `${title} · Kambio`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <PageShell search={<BackToListing />}>
      {state.status === 'loading' && (
        <div aria-busy="true" className="grid grid-cols-[minmax(0,3fr)_minmax(420px,2fr)] gap-10">
          <p role="status" className="sr-only">
            Cargando el anuncio…
          </p>
          <div className="h-[520px] rounded-2xl bg-sheet-high motion-safe:animate-pulse" aria-hidden="true" />
          <div className="h-[520px] rounded-2xl bg-sheet motion-safe:animate-pulse" aria-hidden="true" />
        </div>
      )}

      {(state.status === 'not-found' || state.status === 'error') && (
        <div role="alert" className="max-w-xl rounded-2xl border-[1.5px] border-line bg-sheet p-6">
          <p className="font-display text-2xl font-extrabold">
            {state.status === 'not-found' ? 'Este anuncio no existe' : 'No hemos podido cargar el anuncio'}
          </p>
          <p className="mt-2 text-ink-dim">
            {state.status === 'not-found'
              ? 'Puede que lo hayan retirado o que el enlace esté mal.'
              : state.message}
          </p>
          <div className="mt-5 flex items-center gap-5">
            {state.status === 'error' && (
              <button type="button" onClick={reload} className={`h-11 px-5 ${PRIMARY_BUTTON}`}>
                Reintentar
              </button>
            )}
            <Link to="/" className="font-semibold text-violet-soft underline underline-offset-4 hover:text-ink">
              Ver todos los anuncios
            </Link>
          </div>
        </div>
      )}

      {state.status === 'ready' && published && (
        <div className="mb-6">
          <FormAlert role="status">{publishedMessage(state.product, published)}</FormAlert>
        </div>
      )}

      {state.status === 'ready' && (
        <article className="grid grid-cols-[minmax(0,3fr)_minmax(420px,2fr)] items-start gap-10">
          <div className="flex flex-col gap-8">
            <ProductGallery
              name={state.product.name}
              images={state.product.image_url ? [state.product.image_url] : []}
              sold={state.product.status === 'sold'}
            />
            <section aria-labelledby="description-heading">
              <h2 id="description-heading" className="font-display text-2xl font-extrabold">
                Descripción
              </h2>
              <p className="mt-3 max-w-[68ch] text-lg leading-8 whitespace-pre-line text-ink-dim">
                {state.product.description}
              </p>
            </section>
          </div>

          <div className="flex flex-col gap-7 rounded-2xl border-[1.5px] border-line bg-sheet p-8">
            <div className="flex flex-col gap-4">
              <div>
                <StatusTag status={state.product.status} />
              </div>
              <p
                className={
                  state.product.status === 'sold'
                    ? 'font-display text-[64px] leading-none font-extrabold tracking-[-0.02em] text-ink-faint line-through decoration-4 decoration-ink-faint [font-variant-numeric:tabular-nums]'
                    : 'misregistered font-display text-[64px] leading-none font-extrabold tracking-[-0.02em]'
                }
              >
                {formatPrice(state.product.price)}
              </p>
              <h1 className="font-display text-[32px] leading-tight font-extrabold tracking-[-0.01em]">
                {state.product.name}
              </h1>
              <p className="text-ink-dim">
                {state.product.seller.location ?? 'Ubicación sin indicar'} · Publicado{' '}
                {formatRelativeDate(state.product.created_at)}
              </p>
              <Link
                to={`/?categoria=${encodeURIComponent(state.product.category.name)}`}
                className="w-fit rounded-full border-[1.5px] border-line px-3.5 py-1 text-[15px] text-ink-dim transition-colors duration-150 hover:border-ink-faint hover:text-ink"
              >
                {state.product.category.name}
              </Link>
            </div>

            <BuyPanel product={state.product} onPurchased={replaceProduct} onStale={reload} />

            <SellerCard seller={state.product.seller} listings={state.sellerListings} />
          </div>
        </article>
      )}
    </PageShell>
  );
}
