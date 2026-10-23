import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { loginPath } from '../utils/routes';
import { PRIMARY_BUTTON } from './styles';

export const SLOGAN = 'Pass it, spark change';

// Destello de cuatro puntas, dibujado a mano en un solo trazo cerrado
function Spark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0 text-violet">
      <path
        fill="currentColor"
        d="M10 0c.8 6.2 3.8 9.2 10 10-6.2.8-9.2 3.8-10 10-.8-6.2-3.8-9.2-10-10 6.2-.8 9.2-3.8 10-10Z"
      />
    </svg>
  );
}

function AccountNav() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const here = location.pathname + location.search;

  // Subir un producto pide cuenta: si no hay sesión, se pasa por el login y se vuelve a la subida
  const uploadTarget = isAuthenticated ? '/subir' : loginPath('/subir');

  return (
    <nav aria-label="Cuenta" className="flex items-center gap-6 text-base">
      {isAuthenticated ? (
        <>
          <Link to="/chat" className="font-semibold text-ink-dim hover:text-ink">
            Mensajes
          </Link>
          <Link to="/mis-ventas" className="font-semibold text-ink-dim hover:text-ink">
            Mis ventas
          </Link>
          <button type="button" onClick={logout} className="font-semibold text-ink-faint hover:text-ink">
            Salir
          </button>
        </>
      ) : (
        <Link
          to={loginPath(here)}
          className="font-semibold text-violet-soft underline decoration-violet-deep decoration-2 underline-offset-4 hover:text-ink"
        >
          Entrar
        </Link>
      )}
      <Link to={uploadTarget} className={`h-12 px-6 ${PRIMARY_BUTTON}`}>
        + Subir producto
      </Link>
    </nav>
  );
}

interface HeaderProps {
  // hueco central: en el listado va el buscador; en otras pantallas puede quedar vacío
  search?: ReactNode;
}

export default function Header({ search }: HeaderProps) {
  const location = useLocation();
  // En entrar y crear cuenta el menú de cuenta sobra: ya estás haciendo justo eso
  const onAuthPage = location.pathname === '/login' || location.pathname === '/registro';

  return (
    <header className="flex items-center gap-10 border-b-[1.5px] border-line pb-7">
      <Link to="/" className="group flex flex-col gap-2" aria-label={`Kambio, ${SLOGAN}. Ir al inicio`}>
        {/* El logotipo imprime su segunda pasada en violeta vivo; los precios, en violeta profundo */}
        <span className="logo-mark register-on-focus font-display text-[44px] leading-none font-extrabold tracking-[-0.03em] text-ink">
          Kambio
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-ink-dim">
          <Spark />
          {SLOGAN}
        </span>
      </Link>

      <div className="flex-1">{search}</div>

      {!onAuthPage && <AccountNav />}
    </header>
  );
}
