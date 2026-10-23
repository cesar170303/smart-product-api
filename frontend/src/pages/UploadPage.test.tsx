import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, createProduct, getProducts, uploadImage } from '../api/client';
import { AuthProvider } from '../auth/AuthContext';
import RequireAuth from '../components/RequireAuth';
import { exampleProduct, signInAs } from '../testUtils';
import type { PublishedInfo } from '../utils/published';
import UploadPage from './UploadPage';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  createProduct: vi.fn(),
  uploadImage: vi.fn(),
  getProducts: vi.fn(),
}));

function Where() {
  const location = useLocation();
  const published = (location.state as { published?: PublishedInfo } | null)?.published;
  return (
    <>
      <p data-testid="where">{location.pathname + location.search}</p>
      <p data-testid="published">{published ? JSON.stringify(published) : ''}</p>
    </>
  );
}

function renderUpload() {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/subir']}>
        <Routes>
          <Route
            path="/subir"
            element={
              <RequireAuth>
                <UploadPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

const photo = () => new File([new Uint8Array(10)], 'bici.png', { type: 'image/png' });

async function fillForm({ category = '', price = '120' } = {}) {
  await userEvent.upload(document.querySelector('input[type="file"]') as HTMLInputElement, photo());
  await userEvent.type(screen.getByLabelText('Nombre'), ' Bicicleta urbana ');
  await userEvent.type(screen.getByLabelText('Descripción'), 'Como nueva, con candado.');
  await userEvent.type(screen.getByLabelText('Precio'), price);
  if (category) await userEvent.type(screen.getByLabelText(/Categoría/), category);
}

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Publicar producto' }));

describe('UploadPage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.mocked(getProducts).mockResolvedValue([exampleProduct]);
  });
  afterEach(() => vi.clearAllMocks());

  it('sin sesión lleva al login y vuelve a la subida', () => {
    renderUpload();

    expect(screen.getByTestId('where')).toHaveTextContent('/login?next=%2Fsubir');
  });

  it('no sube nada si faltan datos y lleva el cursor a la foto', async () => {
    signInAs(5);
    renderUpload();

    await submit();

    expect(uploadImage).not.toHaveBeenCalled();
    expect(screen.getByText('Elige una foto del producto.')).toBeInTheDocument();
    expect(screen.getByText(/Ponle un nombre/)).toBeInTheDocument();
    expect(screen.getByText('Indica el precio.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Elegir foto' })).toHaveFocus();
  });

  it('rechaza un archivo que no es JPG, PNG ni WEBP', async () => {
    signInAs(5);
    renderUpload();

    await userEvent.upload(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      new File(['x'], 'doc.gif', { type: 'image/gif' }),
      { applyAccept: false },
    );

    expect(screen.getByText('La foto tiene que ser JPG, PNG o WEBP.')).toBeInTheDocument();
    expect(screen.queryByText('doc.gif')).not.toBeInTheDocument();
  });

  it('sube la foto, publica el anuncio y va a su ficha con el aviso de la categoría de la IA', async () => {
    const token = signInAs(5);
    vi.mocked(uploadImage).mockResolvedValue('/media/0123456789abcdef0123456789abcdef.png');
    vi.mocked(createProduct).mockResolvedValue({ ...exampleProduct, id: 31 });
    renderUpload();

    await fillForm({ price: '120,5' });
    await submit();

    expect(uploadImage).toHaveBeenCalledWith(expect.any(File), token);
    expect(createProduct).toHaveBeenCalledWith(
      {
        name: 'Bicicleta urbana',
        description: 'Como nueva, con candado.',
        price: 120.5,
        image_url: '/media/0123456789abcdef0123456789abcdef.png',
        category: null,
      },
      token,
    );
    expect(await screen.findByTestId('where')).toHaveTextContent('/producto/31');
    expect(JSON.parse(screen.getByTestId('published').textContent ?? '{}')).toEqual({ aiCategory: true });
  });

  it('con categoría escrita, la manda y no marca que la eligió la IA', async () => {
    const token = signInAs(5);
    vi.mocked(uploadImage).mockResolvedValue('/media/0123456789abcdef0123456789abcdef.png');
    vi.mocked(createProduct).mockResolvedValue({ ...exampleProduct, id: 32 });
    renderUpload();

    await fillForm({ category: 'Deporte' });
    await submit();

    expect(createProduct).toHaveBeenCalledWith(expect.objectContaining({ category: 'Deporte' }), token);
    expect(JSON.parse((await screen.findByTestId('published')).textContent ?? '{}').aiCategory).toBe(false);
  });

  it('el precio es el que escribes: ninguna categoría lo recalcula, ni en la vista previa ni al enviar', async () => {
    const token = signInAs(5);
    vi.mocked(uploadImage).mockResolvedValue('/media/0123456789abcdef0123456789abcdef.png');
    vi.mocked(createProduct).mockResolvedValue({ ...exampleProduct, id: 34 });
    renderUpload();

    await fillForm({ category: 'Tecnología', price: '100' });

    expect(screen.queryByText(/IVA/)).not.toBeInTheDocument();
    expect(screen.getByText(/Se publica tal cual lo escribes/)).toBeInTheDocument();
    // la vista previa enseña 100 €, no 121 €
    expect(screen.getAllByText(/100\s€/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/121/)).not.toBeInTheDocument();

    await submit();

    expect(createProduct).toHaveBeenCalledWith(expect.objectContaining({ price: 100, category: 'Tecnología' }), token);
  });

  it('si el anuncio falla tras subir la foto, al reintentar no vuelve a subirla', async () => {
    signInAs(5);
    vi.mocked(uploadImage).mockResolvedValue('/media/0123456789abcdef0123456789abcdef.png');
    vi.mocked(createProduct)
      .mockRejectedValueOnce(new ApiError('Ha ocurrido un error en el servidor', 500))
      .mockResolvedValueOnce({ ...exampleProduct, id: 33 });
    renderUpload();

    await fillForm();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent('Ha ocurrido un error en el servidor');

    await submit();

    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(createProduct).toHaveBeenCalledTimes(2);
    expect(await screen.findByTestId('where')).toHaveTextContent('/producto/33');
  });

  it('si la API rechaza la foto, el aviso sale en el campo de la foto', async () => {
    signInAs(5);
    vi.mocked(uploadImage).mockRejectedValue(new ApiError('El archivo no es una imagen válida (solo JPEG, PNG o WEBP)', 415));
    renderUpload();

    await fillForm();
    await submit();

    expect(await screen.findByText(/no es una imagen válida/)).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it('si la sesión caducó (401), vuelve al login', async () => {
    signInAs(5);
    vi.mocked(uploadImage).mockRejectedValue(new ApiError('No autenticado', 401));
    renderUpload();

    await fillForm();
    await submit();

    expect(await screen.findByTestId('where')).toHaveTextContent('/login?next=%2Fsubir');
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });
});
