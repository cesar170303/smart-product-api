import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, loginUser, registerUser } from '../api/client';
import { AuthProvider } from '../auth/AuthContext';
import { fakeToken } from '../testUtils';
import RegisterPage from './RegisterPage';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

function Where() {
  const location = useLocation();
  const notice = (location.state as { notice?: string } | null)?.notice ?? '';
  return (
    <>
      <p data-testid="where">{location.pathname + location.search}</p>
      <p data-testid="notice">{notice}</p>
    </>
  );
}

function renderRegister() {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/registro?next=%2Fsubir']}>
        <Routes>
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

async function fillAndSubmit(password = 'secreto123') {
  await userEvent.type(screen.getByLabelText('Nombre'), 'Ana');
  await userEvent.type(screen.getByLabelText('Email'), 'ana@correo.com');
  await userEvent.type(screen.getByLabelText('Contraseña'), password);
  await userEvent.type(screen.getByLabelText(/Ciudad/), ' Madrid ');
  await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
}

const ONE_HOUR_SECONDS = 3600;
const created = { mensaje: 'Usuario registrado correctamente', usuario: { id: 9, name: 'Ana', email: 'ana@correo.com' } };

describe('RegisterPage', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.clearAllMocks());

  it('no envía nada con una contraseña de menos de 8 caracteres', async () => {
    renderRegister();

    await fillAndSubmit('corta');

    expect(registerUser).not.toHaveBeenCalled();
    expect(screen.getByText(/al menos 8 caracteres/)).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toHaveFocus();
  });

  it('crea la cuenta, entra solo y vuelve a donde ibas', async () => {
    const token = fakeToken({ sub: '9', exp: Math.floor(Date.now() / 1000) + ONE_HOUR_SECONDS });
    vi.mocked(registerUser).mockResolvedValue(created);
    vi.mocked(loginUser).mockResolvedValue({ access_token: token, token_type: 'bearer' });
    renderRegister();

    await fillAndSubmit();

    expect(registerUser).toHaveBeenCalledWith('Ana', 'ana@correo.com', 'secreto123', 'Madrid');
    expect(loginUser).toHaveBeenCalledWith('ana@correo.com', 'secreto123');
    expect(await screen.findByTestId('where')).toHaveTextContent('/subir');
    expect(sessionStorage.getItem('access_token')).toBe(token);
  });

  it('un email ya registrado se avisa en el campo del email', async () => {
    vi.mocked(registerUser).mockRejectedValue(new ApiError('Ya existe una cuenta con ese email', 409));
    renderRegister();

    await fillAndSubmit();

    expect(await screen.findByText('Ya existe una cuenta con ese email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Email')).toHaveFocus();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it('si la cuenta se crea pero el acceso automático falla, lleva al login con un aviso', async () => {
    vi.mocked(registerUser).mockResolvedValue(created);
    vi.mocked(loginUser).mockRejectedValue(new ApiError('Demasiadas peticiones. Inténtalo de nuevo en un minuto', 429));
    renderRegister();

    await fillAndSubmit();

    expect(await screen.findByTestId('where')).toHaveTextContent('/login?next=%2Fsubir');
    expect(screen.getByTestId('notice')).toHaveTextContent('Tu cuenta está creada');
  });

  it('otro error del servidor se muestra en el formulario', async () => {
    vi.mocked(registerUser).mockRejectedValue(new ApiError('Ha ocurrido un error en el servidor', 500));
    renderRegister();

    await fillAndSubmit();

    expect(await screen.findByRole('alert')).toHaveTextContent('Ha ocurrido un error en el servidor');
  });
});
