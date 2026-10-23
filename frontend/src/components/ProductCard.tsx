import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imageSrc } from '../api/client';
import type { Product } from '../api/types';
import { formatPrice } from '../utils/format';
import SoldStamp from './SoldStamp';
import StatusTag from './StatusTag';

const HALFTONE_VARIANTS = ['', 'halftone-fine', 'halftone-coarse'];

interface ProductCardProps {
  product: Product;
  // posición en la rejilla: escalona la entrada de los pliegos
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isSold = product.status === 'sold';
  const halftone = HALFTONE_VARIANTS[product.id % HALFTONE_VARIANTS.length];

  return (
    <li className="print-in" style={{ '--i': index } as React.CSSProperties}>
      <Link
        to={`/producto/${product.id}`}
        className={`group block overflow-hidden rounded-2xl border-[1.5px] bg-sheet transition-[border-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:border-violet hover:border-solid focus-visible:border-violet focus-visible:border-solid motion-safe:hover:-translate-y-1.5 motion-safe:focus-visible:-translate-y-1.5 ${isSold ? 'border-dashed border-ink-faint/60' : 'border-line'}`}
      >
        <div className="relative h-[236px] overflow-hidden">
          {imageFailed || !product.image_url ? (
            <div className={`halftone h-full ${halftone}`} role="img" aria-label={`Sin foto de ${product.name}`} />
          ) : (
            <img
              src={imageSrc(product.image_url)}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
          {isSold && <SoldStamp />}
        </div>
        <div className="flex flex-col gap-1 px-4 pt-3.5 pb-4">
          {/* Un anuncio vendido pierde sus tintas: precio tachado y apagado, sin segunda pasada */}
          <p
            className={
              isSold
                ? 'font-display text-[36px] leading-10 font-extrabold tracking-[-0.01em] text-ink-faint line-through decoration-[3px] decoration-ink-faint [font-variant-numeric:tabular-nums]'
                : 'misregistered register-on-focus origin-left font-display text-[36px] leading-10 font-extrabold tracking-[-0.01em] transition-[transform,color] duration-300 ease-[var(--ease-out-expo)] group-hover:text-violet-soft group-focus-visible:text-violet-soft motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:scale-110'
            }
          >
            {formatPrice(product.price)}
          </p>
          {/* Dos líneas de altura fija: así las etiquetas de estado quedan alineadas aunque el nombre sea largo */}
          <h2 title={product.name} className={`line-clamp-2 min-h-12 text-base leading-6 ${isSold ? 'text-ink-faint' : 'text-ink-dim'}`}>
            {product.name}
          </h2>
          <div className="mt-2 flex items-center justify-between gap-3">
            <StatusTag status={product.status} />
            <span className="truncate text-sm text-ink-faint">{product.category.name}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
