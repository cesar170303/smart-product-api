import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeToken } from '../testUtils';
import { AuthProvider, useAuth } from './AuthContext';

function Probe() {
  const { isAuthenticated } = useAuth();
  return <p>{isAuthenticated ? 'dentro' : 'fuera'}</p>;
}

const SECONDS_UNTIL_EXPIRY = 30;

function signInExpiringIn(seconds: number): string {
  const token = fakeToken({ sub: '5', exp: Math.floor(Date.now() / 1000) + seconds });
  sessionStorage.setItem('access_token', token);
  return token;
}

describe('AuthProvider: caducidad del token', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.useRealTimers());

  it('cierra la sesión sola cuando el token caduca, sin esperar a una petición', () => {
    vi.useFakeTimers();
    signInExpiringIn(SECONDS_UNTIL_EXPIRY);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(screen.getByText('dentro')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime((SECONDS_UNTIL_EXPIRY + 1) * 1000));

    expect(screen.getByText('fuera')).toBeInTheDocument();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });

  it('si el navegador frenó el temporizador, al volver a la pestaña se comprueba la caducidad', () => {
    vi.useFakeTimers();
    signInExpiringIn(SECONDS_UNTIL_EXPIRY);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    // pasa el tiempo sin que salte el temporizador (pestaña oculta) y se vuelve a la pestaña
    vi.setSystemTime(Date.now() + (SECONDS_UNTIL_EXPIRY + 5) * 1000);
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(screen.getByText('fuera')).toBeInTheDocument();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });

  it('un token que ya estaba caducado al abrir la página se borra', async () => {
    signInExpiringIn(-60);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(screen.getByText('fuera')).toBeInTheDocument();
    await waitFor(() => expect(sessionStorage.getItem('access_token')).toBeNull());
  });

  it('un token válido mantiene la sesión', () => {
    vi.useFakeTimers();
    signInExpiringIn(3600);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    act(() => vi.advanceTimersByTime(60_000));

    expect(screen.getByText('dentro')).toBeInTheDocument();
  });
});
