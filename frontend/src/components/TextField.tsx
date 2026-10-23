import { useState } from 'react';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
  // texto de ayuda bajo el campo (se oculta si hay error)
  hint?: string;
  error?: string;
  // marca el campo como no obligatorio en la etiqueta
  optional?: boolean;
  // varias líneas (descripciones)
  multiline?: boolean;
  rows?: number;
  // teclado que se abre en móvil y accesibilidad ("decimal" para precios)
  inputMode?: 'text' | 'decimal';
  // texto fijo a la derecha del campo, por ejemplo "€"
  suffix?: string;
  // id de un <datalist> con sugerencias
  list?: string;
  maxLength?: number;
}

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 3 2.5 16.5h15L10 3Z" strokeLinejoin="round" />
      <path d="M10 8.5v3.5M10 14.5v.01" />
    </svg>
  );
}

export default function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  hint,
  error,
  optional,
  multiline,
  rows,
  inputMode,
  suffix,
  list,
  maxLength,
}: TextFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error || hint);

  // En un campo con error el borde ámbar manda también con el foco puesto
  const border = error ? 'border-amber' : 'border-ink-faint/60 hover:border-ink-faint focus:border-violet';
  const common = {
    id,
    value,
    autoComplete,
    spellCheck: false,
    maxLength,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': hasMessage ? messageId : undefined,
  } as const;
  const base = `w-full rounded-[10px] border-[1.5px] bg-sheet text-base text-ink transition-colors duration-150 ${border}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between text-[15px] font-semibold text-ink-dim">
        <span>{label}</span>
        {optional && <span className="text-sm font-normal text-ink-faint">Opcional</span>}
      </label>

      <div className="relative">
        {multiline ? (
          <textarea
            {...common}
            rows={rows}
            onChange={(event) => onChange(event.target.value)}
            className={`${base} resize-y px-4 py-3 leading-7`}
          />
        ) : (
          <input
            {...common}
            type={isPassword && revealed ? 'text' : type}
            inputMode={inputMode}
            list={list}
            onChange={(event) => onChange(event.target.value)}
            className={`${base} h-12 px-4 ${isPassword ? 'pr-24' : ''} ${suffix ? 'pr-12' : ''}`}
          />
        )}
        {suffix && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-ink-faint">
            {suffix}
          </span>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-pressed={revealed}
            className="absolute inset-y-0 right-0 px-4 text-sm font-semibold text-violet-soft hover:text-ink"
          >
            {revealed ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>

      {hasMessage && (
        <p id={messageId} className={`flex gap-1.5 text-sm ${error ? 'text-amber' : 'text-ink-faint'}`}>
          {error && <WarningIcon />}
          <span>{error ?? hint}</span>
        </p>
      )}
    </div>
  );
}
