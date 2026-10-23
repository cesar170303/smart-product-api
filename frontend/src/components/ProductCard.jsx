import { imageSrc } from '../api/client.js';

const STATUS_LABELS = {
  available: 'Disponible',
  reserved: 'Reservado',
  sold: 'Vendido',
};

const STATUS_STYLES = {
  available: 'bg-emerald-500/20 text-emerald-300',
  reserved: 'bg-amber-500/20 text-amber-300',
  sold: 'bg-slate-600/40 text-slate-300',
};

export default function ProductCard({ product }) {
  const price = product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

  return (
    <article className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col">
      <img
        src={imageSrc(product.image_url)}
        alt={product.name}
        loading="lazy"
        className={`w-full aspect-[4/3] object-cover bg-slate-700 ${product.status === 'sold' ? 'opacity-50' : ''}`}
      />
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
          <span className="font-bold text-sky-400 whitespace-nowrap">{price}</span>
        </div>
        <p className="text-slate-300 text-sm line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{product.category.name} · {product.seller.name}</span>
          <span className={`px-2 py-1 rounded-full ${STATUS_STYLES[product.status]}`}>
            {STATUS_LABELS[product.status]}
          </span>
        </div>
      </div>
    </article>
  );
}
