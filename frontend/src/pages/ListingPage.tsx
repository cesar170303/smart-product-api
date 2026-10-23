import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Product } from '../api/types';
import CategoryChips from '../components/CategoryChips';
import PageShell from '../components/PageShell';
import ProductCard from '../components/ProductCard';
import SearchField from '../components/SearchField';
import { useProducts } from '../hooks/useProducts';
import { normalize } from '../utils/format';

const SKELETON_COUNT = 6;
// Solo los primeros pliegos se escalonan al entrar; el resto aparece a la vez para no hacer esperar
const MAX_STAGGER = 11;
const GRID ='grid grid-cols-3 gap-6 min-[1800px]:grid-cols-4';

function newestFirst(a: Product, b: Product): number {
  return Date.parse(b.created_at) - Date.parse(a.created_at);
}

// Busca en nombre, descripción y categoría, sin distinguir acentos ni mayúsculas
function matchesQuery(product: Product, query: string): boolean {
  if (!query) return true;
  const haystack = normalize(`${product.name} ${product.description} ${product.category.name}`);
  return haystack.includes(query);
}

export default function ListingPage() {
  const { state, retry } = useProducts();
  // La búsqueda y la categoría viven en la URL: se pueden compartir y sobreviven a un "volver"
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const category = params.get('categoria');

  const updateParam = (key: string, value: string | null) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  const products = state.status === 'ready' ? state.products : null;

  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((product) => product.category.name))].sort((a, b) => a.localeCompare(b, 'es'));
  }, [products]);

  const visible = useMemo(() => {
    if (!products) return [];
    const normalizedQuery = normalize(query);
    return products
      .filter((product) => (category ? product.category.name === category : true))
      .filter((product) => matchesQuery(product, normalizedQuery))
      .sort(newestFirst);
  }, [products, query, category]);

  const clearFilters = () => setParams({}, { replace: true });

  return (
    <PageShell search={<SearchField value={query} onChange={(value) => updateParam('q', value)} />}>
      <h1 className="sr-only">Anuncios de segunda mano</h1>

      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryChips categories={categories} selected={category} onSelect={(value) => updateParam('categoria', value)} />
        </div>
      )}

      {state.status === 'loading' && (
        <div aria-busy="true">
          <p role="status" className="sr-only">
            Cargando anuncios…
          </p>
          <ul className={GRID} aria-hidden="true">
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <li key={index} className="overflow-hidden rounded-2xl border-[1.5px] border-line bg-sheet">
                {/* Bloque liso: la trama de puntos solo significa "sin foto", nunca "cargando" */}
                <div className="h-[236px] bg-sheet-high motion-safe:animate-pulse" />
                <div className="h-[128px]" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.status === 'error' && (
        <div role="alert" className="max-w-xl rounded-2xl border-[1.5px] border-line bg-sheet p-6">
          <p className="font-display text-2xl font-extrabold">No hemos podido cargar los anuncios</p>
          <p className="mt-2 text-ink-dim">{state.message}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-5 inline-flex h-11 items-center rounded-[10px] bg-violet px-5 font-semibold text-paper transition-colors duration-150 hover:bg-violet-soft"
          >
            Reintentar
          </button>
        </div>
      )}

      {state.status === 'ready' && products?.length === 0 && (
        <div className="max-w-xl rounded-2xl border-[1.5px] border-dashed border-line p-6">
          <p className="font-display text-2xl font-extrabold">Todavía no hay anuncios</p>
          <p className="mt-2 text-ink-dim">Sé el primero en subir algo y aparecerá aquí.</p>
          <Link
            to={`/login?next=${encodeURIComponent('/subir')}`}
            className="mt-5 inline-flex h-11 items-center rounded-[10px] bg-violet px-5 font-semibold text-paper transition-colors duration-150 hover:bg-violet-soft"
          >
            + Subir producto
          </Link>
        </div>
      )}

      {state.status === 'ready' && products && products.length > 0 && (
        <>
          {visible.length > 0 ? (
            <ul className={GRID}>
              {visible.map((product, index) => (
                <ProductCard key={product.id} product={product} index={Math.min(index, MAX_STAGGER)} />
              ))}
            </ul>
          ) : (
            <div className="max-w-xl rounded-2xl border-[1.5px] border-dashed border-line p-6">
              <p className="font-display text-2xl font-extrabold">
                {query ? `Nada para «${query}»` : 'No hay anuncios en esta categoría'}
              </p>
              <p className="mt-2 text-ink-dim">Prueba con otra palabra o quita los filtros.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-11 items-center rounded-[10px] border-[1.5px] border-ink-faint px-5 font-semibold transition-colors duration-150 hover:border-ink"
              >
                Quitar filtros
              </button>
            </div>
          )}

          <p role="status" className="mt-6 text-sm text-ink-faint">
            Mostrando {visible.length} de {products.length} anuncios
          </p>
        </>
      )}
    </PageShell>
  );
}
