import type { ReactNode } from 'react';
import Header from './Header';

interface PageShellProps {
  search?: ReactNode;
  children: ReactNode;
}

// Marco común de todas las pantallas: cabecera y columna central
export default function PageShell({ search, children }: PageShellProps) {
  return (
    <div className="mx-auto min-h-screen w-full min-w-[1100px] max-w-[1740px] px-12 pt-8 pb-16">
      <Header search={search} />
      <main className="mt-6">{children}</main>
    </div>
  );
}
