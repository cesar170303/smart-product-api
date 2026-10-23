import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getProduct, getProducts } from '../api/client';
import { AuthProvider } from '../auth/AuthContext';
import { exampleProduct } from '../testUtils';
import ProductDetailPage from './ProductDetailPage';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  getProduct: vi.fn(),
  getProducts: vi.fn(),
}));

function renderPage(state?: object) {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ pathname: '/producto/7', state }]}>
        <Routes>
          <Route path="/producto/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('ProductDetailPage', () => {
  beforeEach(() => sessionStorage.clear());

  it('muestra precio, nombre, estado, descripción y vendedor', async () => {
    vi.mocked(getProduct).mockResolvedValue(exampleProduct);
    vi.mocked(getProducts).mockResolvedValue([exampleProduct, { ...exampleProduct, id: 8 }]);
    renderPage();

    expect(await screen.findByRole('heading', { level: 1, name: 'iPhone 12 128GB' })).toBeInTheDocument();
    expect(screen.getByText('En venta')).toBeInTheDocument();
    expect(screen.getAllByText(/290/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Funciona perfectamente/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Laura M.' })).toBeInTheDocument();
    expect(screen.getByText(/Alcalá de Henares · 2 anuncios en Kambio/)).toBeInTheDocument();
  });

  it('si no se pueden contar los anuncios del vendedor, la ficha se muestra igual', async () => {
    vi.mocked(getProduct).mockResolvedValue(exampleProduct);
    vi.mocked(getProducts).mockRejectedValue(new Error('caído'));
    renderPage();

    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Alcalá de Henares')).toBeInTheDocument();
  });

  it('recién publicado, cuenta la categoría de la IA y el cambio de precio', async () => {
    vi.mocked(getProduct).mockResolvedValue({ ...exampleProduct, price: 121 });
    vi.mocked(getProducts).mockResolvedValue([]);
    renderPage({ published: { requestedPrice: 100, aiCategory: true } });

    const notice = await screen.findByText(/Anuncio publicado\./);
    expect(notice).toHaveTextContent('La IA le ha puesto la categoría «Tecnología»');
    expect(notice).toHaveTextContent('+21 % de IVA');
    expect(notice).toHaveAttribute('role', 'status');
  });

  it('recién publicado sin cambio de precio ni IA, solo confirma la publicación', async () => {
    vi.mocked(getProduct).mockResolvedValue({ ...exampleProduct, price: 100 });
    vi.mocked(getProducts).mockResolvedValue([]);
    renderPage({ published: { requestedPrice: 100, aiCategory: false } });

    const notice = await screen.findByText(/Anuncio publicado\./);
    expect(notice).toHaveTextContent(/^Anuncio publicado\.$/);
  });

  it('un anuncio que no existe muestra un aviso en español', async () => {
    vi.mocked(getProduct).mockRejectedValue(new ApiError('Producto no encontrado', 404));
    vi.mocked(getProducts).mockResolvedValue([]);
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('Este anuncio no existe');
  });

  it('un fallo de red ofrece reintentar', async () => {
    vi.mocked(getProduct).mockRejectedValue(new TypeError('Failed to fetch'));
    vi.mocked(getProducts).mockResolvedValue([]);
    renderPage();

    expect(await screen.findByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No hemos podido conectar con el servidor');
  });
});
