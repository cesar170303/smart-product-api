import PhotoCanvas from './PhotoCanvas';
import StatusTag from './StatusTag';

interface ListingPreviewProps {
  file: File | null;
  name: string;
  // precio ya formateado, o null si todavía no hay uno válido
  price: string | null;
  category: string;
  onUndecodable: () => void;
}

// Cómo se verá el anuncio en el listado. Es solo una muestra: no se puede pulsar ni la leen los lectores de pantalla.
export default function ListingPreview({ file, name, price, category, onUndecodable }: ListingPreviewProps) {
  const hasName = name.trim().length > 0;

  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl border-[1.5px] border-line bg-sheet">
      <div className="h-[236px] overflow-hidden">
        {file ? <PhotoCanvas file={file} label="" onUndecodable={onUndecodable} /> : <div className="halftone h-full" />}
      </div>
      <div className="flex flex-col gap-1 px-4 pt-3.5 pb-4">
        {/* Sin precio todavía, el marcador va liso: la doble tinta solo se imprime sobre un precio real */}
        <p className={`font-display text-[36px] leading-10 font-extrabold tracking-[-0.01em] ${price ? 'misregistered' : 'text-ink-faint'}`}>
          {price ?? '— €'}
        </p>
        <p className={`line-clamp-2 min-h-12 text-base leading-6 ${hasName ? 'text-ink-dim' : 'text-ink-faint'}`}>
          {hasName ? name.trim() : 'El nombre de tu producto'}
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <StatusTag status="available" />
          <span className="truncate text-sm text-ink-faint">{category.trim() || 'Categoría automática'}</span>
        </div>
      </div>
    </div>
  );
}
