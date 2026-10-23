import type { Seller } from '../api/types';

interface SellerCardProps {
  seller: Seller;
  // anuncios publicados por esta persona, contados del listado; null si no se pudo contar
  listings: number | null;
}

export default function SellerCard({ seller, listings }: SellerCardProps) {
  const initial = seller.name.trim().charAt(0).toUpperCase();

  return (
    <section aria-labelledby="seller-heading" className="flex items-center gap-4 border-t-[1.5px] border-line pt-6">
      <span
        aria-hidden="true"
        className="grid size-14 shrink-0 place-items-center rounded-full border-[1.5px] border-violet bg-violet-deep font-display text-2xl font-extrabold text-ink"
      >
        {initial}
      </span>
      <div className="min-w-0">
        <h2 id="seller-heading" className="truncate font-display text-xl font-extrabold">
          {seller.name}
        </h2>
        <p className="truncate text-ink-dim">
          {seller.location ?? 'Ubicación sin indicar'}
          {listings !== null && ` · ${listings} ${listings === 1 ? 'anuncio' : 'anuncios'} en Kambio`}
        </p>
      </div>
    </section>
  );
}
