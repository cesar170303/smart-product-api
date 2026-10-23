import type { ReactNode } from 'react';

interface FormAlertProps {
  // "alert" interrumpe al lector de pantalla (errores); "status" avisa sin interrumpir (avisos informativos)
  role?: 'alert' | 'status';
  children: ReactNode;
}

export default function FormAlert({ role = 'alert', children }: FormAlertProps) {
  const isError = role === 'alert';
  return (
    <p
      role={role}
      className={`rounded-lg border-[1.5px] px-4 py-3 text-[15px] ${isError ? 'border-amber text-amber' : 'border-violet text-ink-dim'}`}
    >
      {children}
    </p>
  );
}
