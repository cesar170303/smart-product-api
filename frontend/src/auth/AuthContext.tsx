import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { clearToken, getToken, saveToken } from '../utils/auth';
import { getTokenExpiry, getUserIdFromToken } from '../utils/jwt';

interface AuthState {
  token: string | null;
  // id del usuario según el token (solo para decidir qué mostrar; la seguridad la pone el backend)
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

// El mayor retraso que admite setTimeout (con más, salta al instante)
const MAX_TIMER_MS = 2_147_483_647;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());

  const login = useCallback((newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  // La sesión se cierra sola cuando el token caduca. Sin esto, con la pestaña abierta, la interfaz seguiría
  // pareciendo "con sesión" (cabecera, botones, rutas protegidas) hasta que una petición devolviera 401.
  useEffect(() => {
    const expiry = getTokenExpiry(token);
    if (expiry === null) return;

    const expireIfDue = () => {
      if (Date.now() >= expiry) logout();
    };
    // Los navegadores frenan los temporizadores de las pestañas ocultas: al volver se vuelve a comprobar
    const onVisible = () => {
      if (!document.hidden) expireIfDue();
    };

    const timer = setTimeout(expireIfDue, Math.min(Math.max(expiry - Date.now(), 0), MAX_TIMER_MS));
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [token, logout]);

  const value = useMemo(() => {
    // Un token caducado cuenta como sesión cerrada
    const userId = getUserIdFromToken(token);
    return { token: userId === null ? null : token, userId, isAuthenticated: userId !== null, login, logout };
  }, [token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
