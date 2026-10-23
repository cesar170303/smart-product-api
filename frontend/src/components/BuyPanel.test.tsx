import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, createOrder } from '../api/client';
import type { Product } from '../api/types';
import { AuthProvider } from '../auth/AuthContext';
import { exampleProduct, signInAs } from '../testUtils';
import BuyPanel from './BuyPanel';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  createOrder: vi.fn(),
}));

const BUYER_ID = 5;
const SELLER_ID = exampleProduct.seller.id;

function Where() {
  const location = useLocation();
  return <p data-testid="where">{location.pathname + location.search}</p>;
}

function renderPanel(product: Product = exampleProduct) {
  const onPurchased = vi.fn();
  const onStale = vi.fn();
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/producto/7']}>
        <Routes>
          <Route
            path="/producto/7"
            element={
              <>
                <BuyPanel product={product} onPurchased={onPurchased} onStale={onStale} />
                <Where />
              </>
            }
          />
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
  return { onPurchased, onStale };
}

describe('BuyPanel', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.clearAllMocks());

  it('sin sesión, Comprar lleva al login y vuelve a la ficha', async () => {
    renderPanel();

    await userEvent.click(screen.getByRole('button', { name: /Comprar por/ }));

    expect(screen.getByTestId('where')).toHaveTextContent('/login?next=%2Fproducto%2F7');
    expect(createOrder).not.toHaveBeenCalled();
  });

  it('sin sesión, Chatear lleva al login y vuelve al chat', async () => {
    renderPanel();

    await userEvent.click(screen.getByRole('button', { name: 'Chatear con el vendedor' }));

    expect(screen.getByTestId('where')).toHaveTextContent('/login?next=%2Fchat%2F7');
  });

  it('pide confirmación antes de comprar y registra el pedido', async () => {
    const token = signInAs(BUYER_ID);
    const reserved: Product = { ...exampleProduct, status: 'reserved' };
    vi.mocked(createOrder).mockResolvedValue({ id: 1, buyer_id: BUYER_ID, status: 'pending', created_at: '', product: reserved });
    const { onPurchased } = renderPanel();

    await userEvent.click(screen.getByRole('button', { name: /Comprar por/ }));
    expect(createOrder).not.toHaveBeenCalled();
    expect(screen.getByText('¿Confirmas la compra?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));

    expect(createOrder).toHaveBeenCalledWith(7, token);
    expect(onPurchased).toHaveBeenCalledWith(reserved);
    expect(await screen.findByText('Compra registrada')).toBeInTheDocument();
  });

  it('Cancelar en la confirmación no compra nada', async () => {
    signInAs(BUYER_ID);
    renderPanel();

    await userEvent.click(screen.getByRole('button', { name: /Comprar por/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(createOrder).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Comprar por/ })).toBeInTheDocument();
  });

  it('si alguien se adelantó (409) muestra el aviso y vuelve a pedir el anuncio', async () => {
    signInAs(BUYER_ID);
    vi.mocked(createOrder).mockRejectedValue(new ApiError('El producto no está disponible', 409));
    const { onStale } = renderPanel();

    await userEvent.click(screen.getByRole('button', { name: /Comprar por/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar compra' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('El producto no está disponible');
    expect(onStale).toHaveBeenCalled();
  });

  it('en tu propio anuncio no hay Comprar ni Chatear', () => {
    signInAs(SELLER_ID);
    renderPanel();

    expect(screen.getByText('Este anuncio es tuyo')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Comprar/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Chatear/ })).not.toBeInTheDocument();
  });

  it('un anuncio reservado no se puede comprar, pero sí chatear', () => {
    signInAs(BUYER_ID);
    renderPanel({ ...exampleProduct, status: 'reserved' });

    expect(screen.getByText('Ya está reservado')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Comprar/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chatear con el vendedor' })).toBeInTheDocument();
  });

  it('un anuncio vendido no se puede comprar ni chatear', () => {
    signInAs(BUYER_ID);
    renderPanel({ ...exampleProduct, status: 'sold' });

    expect(screen.getByText('Este artículo ya se vendió')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Comprar/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Chatear/ })).not.toBeInTheDocument();
  });
});
