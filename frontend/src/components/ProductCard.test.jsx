import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

const product = {
  id: 1,
  name: 'Moto Vespa',
  description: 'En buen estado',
  price: 1200,
  image_url: '/media/0123456789abcdef0123456789abcdef.png',
  status: 'reserved',
  category: { id: 1, name: 'Motor' },
  seller: { id: 2, name: 'Alice', location: null },
};

describe('ProductCard', () => {
  it('muestra la foto apuntando al servidor de la API', () => {
    // Arrange + Act
    render(<ProductCard product={product} />);

    // Assert
    const image = screen.getByAltText(product.name);
    expect(image).toHaveAttribute('src', 'http://localhost:8000/media/0123456789abcdef0123456789abcdef.png');
  });

  it('muestra nombre, estado en español, categoría y vendedor', () => {
    // Arrange + Act
    render(<ProductCard product={product} />);

    // Assert
    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(screen.getByText('Reservado')).toBeInTheDocument();
    expect(screen.getByText(/Motor · Alice/)).toBeInTheDocument();
  });
});
