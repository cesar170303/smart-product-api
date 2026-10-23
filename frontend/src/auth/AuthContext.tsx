import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { clearToken, getToken, saveToken } from '../utils/auth';
import { getUserIdFromToken } from '../utils/jwt';

interface AuthState {
  token: string | null;
  // id del usuario según el token (solo para decidir qué mostrar; la seguridad la pone el backend)
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

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
