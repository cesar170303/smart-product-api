import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, loginUser } from '../api/client';
import { AuthProvider } from '../auth/AuthContext';
import { fakeToken, signInAs } from '../testUtils';
import LoginPage from './LoginPage';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  loginUser: vi.fn(),
}));

function Where() {
  const location = useLocation();
  return <p data-testid="where">{location.pathname + location.search}</p>;
}

function renderLogin(entry = '/login?next=%2Fproducto%2F7') {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

const ONE_HOUR_SECONDS = 3600;

describe('LoginPage', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.clearAllMocks());

  it('explica por qué se pide cuenta según a dónde ibas', () => {
    renderLogin();

    expect(screen.getByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText(/Entra para comprar este artículo/)).toBeInTheDocument();
  });

  it('no envía nada si faltan datos y avisa en cada campo', async () => {
    renderLogin();

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(loginUser).not.toHaveBeenCalled();
    expect(screen.getByText('Escribe tu email.')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu contraseña.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('entra, guarda la sesión y vuelve a la página de origen', async () => {
    const token = fakeToken({ sub: '5', exp: Math.floor(Date.now() / 1000) + ONE_HOUR_SECONDS });
    vi.mocked(loginUser).mockResolvedValue({ access_token: token, token_type: 'bearer' });
    renderLogin();

    await userEvent.type(screen.getByLabelText('Email'), ' ana@correo.com ');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secreto123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(loginUser).toHaveBeenCalledWith('ana@correo.com', 'secreto123');
    expect(await screen.findByTestId('where')).toHaveTextContent('/producto/7');
    expect(sessionStorage.getItem('access_token')).toBe(token);
  });

  it('muestra el error de la API si las credenciales fallan', async () => {
    vi.mocked(loginUser).mockRejectedValue(new ApiError('Email o contraseña incorrectos', 401));
    renderLogin();

    await userEvent.type(screen.getByLabelText('Email'), 'ana@correo.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'mala');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email o contraseña incorrectos');
    expect(screen.getByLabelText('Contraseña')).toHaveFocus();
    expect(screen.queryByTestId('where')).not.toBeInTheDocument();
  });

  it('un fallo de red sale en español', async () => {
    vi.mocked(loginUser).mockRejectedValue(new TypeError('Failed to fetch'));
    renderLogin();

    await userEvent.type(screen.getByLabelText('Email'), 'ana@correo.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secreto123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No hemos podido conectar con el servidor');
  });

  it('la contraseña se puede mostrar y ocultar', async () => {
    renderLogin();

    const password = screen.getByLabelText('Contraseña');
    expect(password).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar' }));
    expect(password).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByRole('button', { name: 'Ocultar' }));
    expect(password).toHaveAttribute('type', 'password');
  });

  it('quien ya tiene sesión vuelve directamente a donde iba', () => {
    signInAs(5);
    renderLogin('/login?next=%2Fsubir');

    expect(screen.getByTestId('where')).toHaveTextContent('/subir');
  });

  it('ignora un "next" que apunta fuera de la app', () => {
    signInAs(5);
    renderLogin('/login?next=https%3A%2F%2Fotra.web');

    expect(screen.getByTestId('where')).toHaveTextContent('/');
  });
});
