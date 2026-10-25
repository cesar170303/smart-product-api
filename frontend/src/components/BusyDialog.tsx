interface BusyDialogProps {
  title: string;
  detail: string;
}

// Cubre la pantalla mientras una petición está en curso: no se puede pulsar nada por debajo ni volver a enviar.
export default function BusyDialog({ title, detail }: BusyDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div role="dialog" aria-modal="true" aria-busy="true" aria-labelledby="busy-dialog-title" className="w-full max-w-[420px] rounded-2xl border-[1.5px] border-violet bg-paper p-6 text-ink">
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className="mt-1 size-5 shrink-0 animate-spin rounded-full border-2 border-violet border-t-transparent motion-reduce:animate-none" />
          <div>
            <h2 id="busy-dialog-title" className="font-display text-xl font-extrabold">{title}</h2>
            <p role="status" className="mt-2 text-[15px] text-ink-dim">{detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
