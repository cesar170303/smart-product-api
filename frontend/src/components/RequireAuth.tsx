import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { loginPath } from '../utils/routes';

// Pantallas que piden cuenta: sin sesión se pasa por el login y se vuelve aquí
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to={loginPath(location.pathname + location.search)} replace />;
  return children;
}
