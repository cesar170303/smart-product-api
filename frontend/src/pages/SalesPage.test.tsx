import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getOrders, getProducts, updateOrderStatus } from '../api/client';
import type { Order, Product } from '../api/types';
import { AuthProvider } from '../auth/AuthContext';
import RequireAuth from '../components/RequireAuth';
import { exampleProduct, signInAs } from '../testUtils';
import SalesPage from './SalesPage';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  getProducts: vi.fn(),
  getOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

const ME = exampleProduct.seller.id;
const product = (id: number, name: string, status: Product['status'], price = 50): Product => ({
  ...exampleProduct,
  id,
  name,
  status,
  price,
});
const bicycle = product(1, 'Bicicleta urbana', 'available', 120);
const phone = product(2, 'iPhone 12', 'reserved', 290);
const shoes = product(3, 'Zapatillas', 'sold', 35);
const pendingOrder: Order = { id: 11, buyer_id: 5, status: 'pending', created_at: '2026-10-22T10:00:00Z', product: phone };

function Where() {
  const location = useLocation();
  return <p data-testid="where">{location.pathname + location.search}</p>;
}

function renderSales() {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/mis-ventas']}>
        <Routes>
          <Route
            path="/mis-ventas"
            element={
              <RequireAuth>
                <SalesPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

const column = (name: RegExp) => screen.getByRole('region', { name });

describe('SalesPage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.mocked(getProducts).mockResolvedValue([bicycle, phone, shoes]);
    vi.mocked(getOrders).mockResolvedValue([pendingOrder]);
  });
  afterEach(() => vi.clearAllMocks());

  it('sin sesión lleva al login y vuelve a Mis ventas', () => {
    renderSales();

    expect(screen.getByTestId('where')).toHaveTextContent('/login?next=%2Fmis-ventas');
  });

  it('reparte los artículos en En venta, Pendiente de envío y Vendido', async () => {
    signInAs(ME);
    renderSales();

    expect(await within(await screen.findByRole('region', { name: /en venta/ })).findByText('Bicicleta urbana')).toBeInTheDocument();
    expect(within(column(/pendientes de envío/)).getByText('iPhone 12')).toBeInTheDocument();
    expect(within(column(/vendidos/)).getByText('Zapatillas')).toBeInTheDocument();
    expect(screen.getByText(/Has vendido 1 artículo por/)).toBeInTheDocument();
  });

  it('pide solo los anuncios de la persona con sesión, no todo el catálogo', async () => {
    signInAs(ME);
    renderSales();

    await screen.findByText('Bicicleta urbana');

    expect(getProducts).toHaveBeenCalledWith(expect.objectContaining({ sellerId: ME }));
  });

  it('no muestra los artículos de otras personas', async () => {
    signInAs(ME);
    const others = { ...product(9, 'Ajeno', 'available'), seller: { id: 99, name: 'Otra', location: null } };
    vi.mocked(getProducts).mockResolvedValue([bicycle, others]);
    renderSales();

    await screen.findByText('Bicicleta urbana');
    expect(screen.queryByText('Ajeno')).not.toBeInTheDocument();
  });

  it('pide confirmación y, al marcarlo como vendido, el artículo pasa a la columna Vendido', async () => {
    const token = signInAs(ME);
    vi.mocked(updateOrderStatus).mockResolvedValue({ ...pendingOrder, status: 'completed', product: { ...phone, status: 'sold' } });
    renderSales();

    await userEvent.click(await screen.findByRole('button', { name: 'Marcar como vendido' }));
    expect(updateOrderStatus).not.toHaveBeenCalled();
    expect(screen.getByText(/no se puede deshacer/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Sí, marcar como vendido' }));

    expect(updateOrderStatus).toHaveBeenCalledWith(11, 'completed', token);
    expect(await within(column(/vendidos/)).findByText('iPhone 12')).toBeInTheDocument();
    expect(within(column(/pendientes de envío/)).queryByText('iPhone 12')).not.toBeInTheDocument();
    expect(screen.getByText(/Has vendido 2 artículos por/)).toBeInTheDocument();
  });

  it('al cancelar el pedido, el artículo vuelve a la columna En venta', async () => {
    signInAs(ME);
    vi.mocked(updateOrderStatus).mockResolvedValue({ ...pendingOrder, status: 'cancelled', product: { ...phone, status: 'available' } });
    renderSales();

    await userEvent.click(await screen.findByRole('button', { name: 'Cancelar pedido' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, cancelar el pedido' }));

    expect(updateOrderStatus).toHaveBeenCalledWith(11, 'cancelled', expect.any(String));
    expect(await within(column(/en venta/)).findByText('iPhone 12')).toBeInTheDocument();
  });

  it('"Volver" en la confirmación no cambia nada', async () => {
    signInAs(ME);
    renderSales();

    await userEvent.click(await screen.findByRole('button', { name: 'Marcar como vendido' }));
    await userEvent.click(screen.getByRole('button', { name: 'Volver' }));

    expect(updateOrderStatus).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Marcar como vendido' })).toBeInTheDocument();
  });

  it('si la API rechaza el cambio, el aviso sale en la fila y el artículo no se mueve', async () => {
    signInAs(ME);
    vi.mocked(updateOrderStatus).mockRejectedValue(new ApiError('El pedido ya está cancelled y no se puede modificar', 409));
    renderSales();

    await userEvent.click(await screen.findByRole('button', { name: 'Marcar como vendido' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, marcar como vendido' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('no se puede modificar');
    expect(within(column(/pendientes de envío/)).getByText('iPhone 12')).toBeInTheDocument();
  });

  it('si la sesión caduca al cambiar el pedido, vuelve al login', async () => {
    signInAs(ME);
    vi.mocked(updateOrderStatus).mockRejectedValue(new ApiError('No autenticado', 401));
    renderSales();

    await userEvent.click(await screen.findByRole('button', { name: 'Marcar como vendido' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, marcar como vendido' }));

    expect(await screen.findByTestId('where')).toHaveTextContent('/login?next=%2Fmis-ventas');
  });

  it('sin artículos, invita a subir el primero', async () => {
    signInAs(ME);
    vi.mocked(getProducts).mockResolvedValue([]);
    vi.mocked(getOrders).mockResolvedValue([]);
    renderSales();

    expect(await screen.findByText('Todavía no has subido nada')).toBeInTheDocument();
    // la cabecera tiene su propio enlace igual: se mira solo el del contenido
    expect(within(screen.getByRole('main')).getByRole('link', { name: '+ Subir producto' })).toHaveAttribute('href', '/subir');
  });

  it('un fallo de red ofrece reintentar', async () => {
    signInAs(ME);
    vi.mocked(getProducts).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    renderSales();

    expect(await screen.findByRole('alert')).toHaveTextContent('No hemos podido conectar con el servidor');

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByText('Bicicleta urbana')).toBeInTheDocument();
  });
});
