interface SoldStampProps {
  // "card" para la tarjeta del listado, "large" para la ficha
  size?: 'card' | 'large';
}

// Sello sobre la foto de un anuncio vendido: tapa una parte, pero no tiñe ni apaga la foto.
// El estado ya lo lee la etiqueta de texto, así que el sello es solo visual.
export default function SoldStamp({ size = 'card' }: SoldStampProps) {
  const text = size === 'large' ? 'px-8 py-3 text-[52px] border-4' : 'px-5 py-2 text-[30px] border-[3px]';
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
      <span
        className={`-rotate-[10deg] rounded-md border-dashed border-ink bg-paper/85 font-display leading-none font-extrabold tracking-[0.1em] text-ink uppercase ${text}`}
      >
        Vendido
      </span>
    </span>
  );
}
