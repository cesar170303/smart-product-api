import { useRef, useState, type DragEvent } from 'react';
import { SECONDARY_BUTTON } from './styles';

const BYTES_PER_MB = 1024 * 1024;

function formatSize(bytes: number): string {
  return `${(bytes / BYTES_PER_MB).toLocaleString('es-ES', { maximumFractionDigits: 1 })} MB`;
}

function CameraIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-9 text-violet-soft" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

interface PhotoFieldProps {
  file: File | null;
  error?: string;
  // llega un archivo nuevo (o null al quitarlo); el padre decide si es válido
  onSelect: (file: File | null) => void;
}

export default function PhotoField({ file, error, onSelect }: PhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const choose = (selected: File | undefined) => {
    if (selected) onSelect(selected);
    // Un <input type="file"> no repite el evento si eliges el mismo archivo dos veces: se vacía siempre
    if (inputRef.current) inputRef.current.value = '';
  };

  // Un error manda sobre el estado de arrastre
  let frame = 'border-ink-faint/60 bg-sheet';
  if (dragging) frame = 'border-violet bg-sheet-high';
  if (error) frame = 'border-amber bg-sheet';

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    choose(event.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span id="photo-label" className="text-[15px] font-semibold text-ink-dim">
        Foto
      </span>

      <div
        role="group"
        aria-labelledby="photo-label"
        aria-describedby={error ? 'photo-message' : 'photo-help'}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex items-center gap-4 rounded-[10px] border-[1.5px] px-5 py-4 transition-colors duration-150 ${frame}`}
      >
        <CameraIcon />
        <div className="min-w-0 flex-1">
          {file ? (
            <>
              <p className="truncate font-semibold text-ink">{file.name}</p>
              <p className="text-sm text-ink-faint">{formatSize(file.size)}</p>
            </>
          ) : (
            <p className="text-ink-dim">Arrastra una foto aquí o elige un archivo.</p>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(event) => choose(event.target.files?.[0])}
        />
        <button id="photo-button" type="button" onClick={() => inputRef.current?.click()} className={`h-11 px-4 ${SECONDARY_BUTTON}`}>
          {file ? 'Cambiar' : 'Elegir foto'}
        </button>
        {file && (
          <button type="button" onClick={() => onSelect(null)} className="text-sm font-semibold text-ink-faint hover:text-ink">
            Quitar
          </button>
        )}
      </div>

      <p id={error ? 'photo-message' : 'photo-help'} className={`text-sm ${error ? 'text-amber' : 'text-ink-faint'}`}>
        {error ?? 'JPG, PNG o WEBP, de hasta 5 MB.'}
      </p>
    </div>
  );
}
