import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import BackToListing from './BackToListing';
import PageShell from './PageShell';

export type AuthMode = 'login' | 'register';

interface AuthShellProps {
  mode: AuthMode;
  // a dónde volverá la persona tras entrar; se conserva al cambiar de pestaña
  next: string;
  // frase que explica por qué se pide cuenta ("comprar este artículo…")
  reason: string;
  children: ReactNode;
}

const TAB = 'rounded-full border-[1.5px] px-4 py-1.5 text-[15px] transition-colors duration-150';
const TAB_ON = 'border-ink bg-ink font-semibold text-paper';
const TAB_OFF = 'border-line text-ink-dim hover:border-ink-faint hover:text-ink';

export default function AuthShell({ mode, next, reason, children }: AuthShellProps) {
  const query = next === '/' ? '' : `?next=${encodeURIComponent(next)}`;

  return (
    <PageShell search={<BackToListing />}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(420px,500px)] items-center gap-16 pt-6">
        <div className="max-w-[640px]">
          <p className="misregistered font-display text-[80px] leading-[0.95] font-extrabold tracking-[-0.03em]">
            Pass it, spark change.
          </p>
          <p className="mt-8 max-w-[38ch] text-xl leading-8 text-ink-dim">
            {mode === 'login' ? 'Entra' : 'Crea tu cuenta'} para {reason}.
          </p>
        </div>

        <div className="rounded-2xl border-[1.5px] border-line bg-sheet p-8">
          <nav aria-label="Acceso" className="mb-7 flex gap-2.5">
            <Link to={`/login${query}`} aria-current={mode === 'login' ? 'page' : undefined} className={`${TAB} ${mode === 'login' ? TAB_ON : TAB_OFF}`}>
              Entrar
            </Link>
            <Link to={`/registro${query}`} aria-current={mode === 'register' ? 'page' : undefined} className={`${TAB} ${mode === 'register' ? TAB_ON : TAB_OFF}`}>
              Crear cuenta
            </Link>
          </nav>
          {children}
        </div>
      </div>
    </PageShell>
  );
}
