import { useEffect, useState } from 'react';
import { getProducts } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductForm from '../components/ProductForm.jsx';

export default function ProductsPage({ token, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // "ignore" evita actualizar el estado si el componente se desmontó antes de que llegara la respuesta
    let ignore = false;

    getProducts()
      .then((data) => {
        if (!ignore) setProducts(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // El producto nuevo ya viene completo de la API: se pone el primero sin volver a pedir la lista
  const handleCreated = (product) => setProducts((current) => [product, ...current]);

  return (
    <section className="w-full max-w-5xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Productos</h2>
        <button onClick={onLogout} className="text-sm text-slate-300 hover:text-white underline">
          Cerrar sesión
        </button>
      </div>

      <ProductForm token={token} onCreated={handleCreated} onUnauthorized={onLogout} />

      {loading && <p className="text-slate-400">Cargando productos…</p>}
      {error && <p role="alert" className="text-red-400">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-slate-400">Todavía no hay productos. ¡Sube el primero!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
