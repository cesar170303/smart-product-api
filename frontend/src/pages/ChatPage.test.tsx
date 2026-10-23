import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getConversations, getMessages, getProduct, getProducts, sendMessage } from '../api/client';
import type { Conversation, Message } from '../api/types';
import { AuthProvider } from '../auth/AuthContext';
import RequireAuth from '../components/RequireAuth';
import { THREAD_POLL_MS } from '../hooks/useThread';
import { exampleProduct, signInAs } from '../testUtils';
import ChatPage from './ChatPage';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  getConversations: vi.fn(),
  getMessages: vi.fn(),
  sendMessage: vi.fn(),
  getProduct: vi.fn(),
  getProducts: vi.fn(),
}));

const SELLER = exampleProduct.seller; // id 2, "Laura M."
const BUYER_ID = 5;
const product = exampleProduct; // id 7

const message = (id: number, senderId: number, body: string, senderName: string): Message => ({
  id,
  product_id: product.id,
  buyer_id: BUYER_ID,
  sender_id: senderId,
  body,
  created_at: new Date(2026, 9, 23, 10, id).toISOString(),
  sender: { id: senderId, name: senderName },
});

const hello = message(1, BUYER_ID, '¿Sigue disponible?', 'Marcos');
const reply = message(2, SELLER.id, 'Sí, claro.', SELLER.name);

const conversationFor = (last: Message, other: { id: number; name: string }): Conversation => ({
  product: { id: product.id, name: product.name, price: product.price, image_url: '', status: 'available' },
  buyer_id: BUYER_ID,
  other,
  last_message: last,
});

function Where() {
  const location = useLocation();
  return <p data-testid="where">{location.pathname + location.search}</p>;
}

function renderChat(entry: string) {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          {['/chat', '/chat/:productId'].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <RequireAuth>
                  <ChatPage />
                </RequireAuth>
              }
            />
          ))}
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

const thread = () => screen.getByRole('log');
// El panel aparece cuando termina de cargar el anuncio: se espera antes de buscar dentro
const inThread = async () => within(await screen.findByRole('log'));
const advancePoll = () => act(() => vi.advanceTimersByTimeAsync(THREAD_POLL_MS));

describe('ChatPage', () => {
  beforeEach(() => {
    // Solo se simulan los temporizadores del refresco; el resto del tiempo es real
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    sessionStorage.clear();
    vi.mocked(getProduct).mockResolvedValue(product);
    vi.mocked(getProducts).mockResolvedValue([product]);
    vi.mocked(getConversations).mockResolvedValue([conversationFor(reply, SELLER)]);
    vi.mocked(getMessages).mockResolvedValue([hello, reply]);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('sin sesión lleva al login y vuelve al chat', () => {
    renderChat('/chat/7');

    expect(screen.getByTestId('where')).toHaveTextContent('/login?next=%2Fchat%2F7');
  });

  it('el comprador ve la conversación con el vendedor, en orden, y la bandeja', async () => {
    signInAs(BUYER_ID);
    renderChat('/chat/7');

    expect(await (await inThread()).findByText('¿Sigue disponible?')).toBeInTheDocument();
    const text = thread().textContent ?? '';
    expect(text.indexOf('¿Sigue disponible?')).toBeLessThan(text.indexOf('Sí, claro.'));
    expect(screen.getByRole('heading', { level: 2, name: SELLER.name })).toBeInTheDocument();
    expect(getMessages).toHaveBeenCalledWith(7, expect.any(String), expect.objectContaining({ buyerId: BUYER_ID, afterId: 0 }));
    expect(within(screen.getByRole('region', { name: 'Conversaciones' })).getByText('Sí, claro.')).toBeInTheDocument();
  });

  it('envía con Intro, añade el mensaje y vacía la caja', async () => {
    const token = signInAs(BUYER_ID);
    const sent = message(3, BUYER_ID, 'Perfecto, lo quiero', 'Marcos');
    vi.mocked(sendMessage).mockResolvedValue(sent);
    renderChat('/chat/7');
    await (await inThread()).findByText('Sí, claro.');

    await userEvent.type(screen.getByLabelText(/Escribe un mensaje/), '  Perfecto, lo quiero{Enter}');

    expect(sendMessage).toHaveBeenCalledWith(7, 'Perfecto, lo quiero', token, BUYER_ID);
    expect(await (await inThread()).findByText('Perfecto, lo quiero')).toBeInTheDocument();
    expect(screen.getByLabelText(/Escribe un mensaje/)).toHaveValue('');
  });

  it('Mayús+Intro hace salto de línea y no envía', async () => {
    signInAs(BUYER_ID);
    renderChat('/chat/7');
    await (await inThread()).findByText('Sí, claro.');

    await userEvent.type(screen.getByLabelText(/Escribe un mensaje/), 'uno{Shift>}{Enter}{/Shift}dos');

    expect(sendMessage).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Escribe un mensaje/)).toHaveValue('uno\ndos');
  });

  it('no deja enviar un mensaje en blanco', async () => {
    signInAs(BUYER_ID);
    renderChat('/chat/7');
    await (await inThread()).findByText('Sí, claro.');

    await userEvent.type(screen.getByLabelText(/Escribe un mensaje/), '   ');

    expect(screen.getByRole('button', { name: 'Enviar' })).toBeDisabled();
  });

  it('si falla el envío, avisa y conserva el texto', async () => {
    signInAs(BUYER_ID);
    vi.mocked(sendMessage).mockRejectedValue(new ApiError('Demasiadas peticiones. Inténtalo de nuevo en un minuto', 429));
    renderChat('/chat/7');
    await (await inThread()).findByText('Sí, claro.');

    await userEvent.type(screen.getByLabelText(/Escribe un mensaje/), 'hola{Enter}');

    expect(await screen.findByRole('alert')).toHaveTextContent('Demasiadas peticiones');
    expect(screen.getByLabelText(/Escribe un mensaje/)).toHaveValue('hola');
  });

  it('cada pocos segundos pide solo las novedades y no duplica mensajes', async () => {
    signInAs(BUYER_ID);
    const news = message(3, SELLER.id, 'Te lo guardo hasta mañana', SELLER.name);
    vi.mocked(getMessages).mockResolvedValueOnce([hello, reply]).mockResolvedValue([news]);
    renderChat('/chat/7');
    await (await inThread()).findByText('Sí, claro.');

    await advancePoll();

    expect(await (await inThread()).findByText('Te lo guardo hasta mañana')).toBeInTheDocument();
    expect(getMessages).toHaveBeenLastCalledWith(7, expect.any(String), expect.objectContaining({ afterId: 2 }));

    // La API repite el mismo mensaje: no sale dos veces
    await advancePoll();
    expect(within(thread()).getAllByText('Te lo guardo hasta mañana')).toHaveLength(1);
  });

  it('si el refresco falla, la conversación sigue en pantalla con un aviso de conexión', async () => {
    signInAs(BUYER_ID);
    vi.mocked(getMessages).mockResolvedValueOnce([hello, reply]).mockRejectedValue(new TypeError('Failed to fetch'));
    renderChat('/chat/7');
    await (await inThread()).findByText('Sí, claro.');

    await advancePoll();

    expect(await screen.findByText(/Sin conexión con el servidor/)).toBeInTheDocument();
    expect(within(thread()).getByText('Sí, claro.')).toBeInTheDocument();
  });

  it('un fallo en la primera carga ofrece reintentar', async () => {
    signInAs(BUYER_ID);
    vi.mocked(getMessages).mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValue([hello]);
    renderChat('/chat/7');

    expect(await (await inThread()).findByRole('alert')).toHaveTextContent('No hemos podido conectar');

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await (await inThread()).findByText('¿Sigue disponible?')).toBeInTheDocument();
  });

  it('una conversación sin mensajes invita a escribir el primero', async () => {
    signInAs(BUYER_ID);
    vi.mocked(getMessages).mockResolvedValue([]);
    vi.mocked(getConversations).mockResolvedValue([]);
    renderChat('/chat/7');

    expect(await screen.findByText(/Escribe el primero a Laura M\./)).toBeInTheDocument();
    expect(screen.getByText('Todavía no tienes conversaciones')).toBeInTheDocument();
  });

  it('el vendedor habla con el comprador que indica y ve su nombre', async () => {
    const token = signInAs(SELLER.id);
    vi.mocked(getConversations).mockResolvedValue([conversationFor(hello, { id: BUYER_ID, name: 'Marcos' })]);
    renderChat('/chat/7?comprador=5');

    expect(await (await inThread()).findByText('¿Sigue disponible?')).toBeInTheDocument();
    expect(getMessages).toHaveBeenCalledWith(7, token, expect.objectContaining({ buyerId: BUYER_ID }));
    expect(screen.getByRole('heading', { level: 2, name: 'Marcos' })).toBeInTheDocument();
    // la fila de la bandeja del vendedor lleva a esta misma conversación
    expect(within(screen.getByRole('region', { name: 'Conversaciones' })).getByRole('link', { current: 'page' })).toHaveAttribute(
      'href',
      '/chat/7?comprador=5',
    );
  });

  it('el vendedor sin comprador indicado debe elegir en la lista', async () => {
    signInAs(SELLER.id);
    renderChat('/chat/7');

    expect(await screen.findByText('Este anuncio es tuyo')).toBeInTheDocument();
    expect(getMessages).not.toHaveBeenCalled();
  });

  it('sin conversación abierta pide elegir una', async () => {
    signInAs(BUYER_ID);
    renderChat('/chat');

    expect(await screen.findByText('Elige una conversación')).toBeInTheDocument();
  });

  it('un anuncio inexistente se avisa en el panel', async () => {
    signInAs(BUYER_ID);
    vi.mocked(getProduct).mockRejectedValue(new ApiError('Producto no encontrado', 404));
    renderChat('/chat/99');

    expect(await screen.findByText('Este anuncio no existe')).toBeInTheDocument();
  });

  it('si la sesión caduca al refrescar, vuelve al login', async () => {
    signInAs(BUYER_ID);
    vi.mocked(getMessages).mockRejectedValue(new ApiError('No autenticado', 401));
    renderChat('/chat/7');

    expect(await screen.findByTestId('where')).toHaveTextContent('/login?next=');
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });
});
