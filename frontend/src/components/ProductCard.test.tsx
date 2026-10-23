import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { Product } from '../api/types';
import ProductCard from './ProductCard';

const product: Product = {
  id: 7,
  name: 'iPhone 12 128GB',
  description: 'Funciona perfectamente',
  price: 290,
  image_url: '/media/0123456789abcdef0123456789abcdef.png',
  status: 'reserved',
  created_at: '2026-10-20T10:00:00Z',
  category: { id: 1, name: 'Tecnología' },
  seller: { id: 2, name: 'Laura', location: 'Alcalá de Henares' },
};

function renderCard(overrides: Partial<Product> = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={{ ...product, ...overrides }} />
    </MemoryRouter>,
  );
}

describe('ProductCard', () => {
  it('enlaza a la ficha del producto', () => {
    renderCard();

    expect(screen.getByRole('link')).toHaveAttribute('href', '/producto/7');
  });

  it('muestra la foto apuntando al servidor de la API', () => {
    renderCard();

    // Solo importa la ruta: el servidor depende de VITE_API_URL
    expect(screen.getByAltText(product.name).getAttribute('src')).toMatch(
      /^https?:\/\/.+\/media\/0123456789abcdef0123456789abcdef\.png$/,
    );
  });

  it('muestra precio, nombre, categoría y el estado en español', () => {
    renderCard();

    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(screen.getByText(/290/)).toBeInTheDocument();
    expect(screen.getByText('Tecnología')).toBeInTheDocument();
    expect(screen.getByText('Pendiente de envío')).toBeInTheDocument();
  });

  it.each([
    ['available', 'En venta'],
    ['reserved', 'Pendiente de envío'],
    ['sold', 'Vendido'],
  ] as const)('traduce el estado %s como "%s"', (status, label) => {
    renderCard({ status });

    expect(screen.getAllByText(label).length).toBeGreaterThan(0);
  });

  it('un anuncio vendido lleva sello sobre la foto, precio tachado y la foto intacta', () => {
    renderCard({ status: 'sold' });

    // etiqueta + sello
    expect(screen.getAllByText('Vendido')).toHaveLength(2);
    expect(screen.getByText(/290/)).toHaveClass('line-through');
    expect(screen.getByAltText(product.name)).not.toHaveClass('opacity-45');
  });

  it('un anuncio a la venta no lleva sello ni precio tachado', () => {
    renderCard({ status: 'available' });

    expect(screen.getAllByText('En venta')).toHaveLength(1);
    expect(screen.queryByText('Vendido')).not.toBeInTheDocument();
    expect(screen.getByText(/290/)).not.toHaveClass('line-through');
  });
});
