import { useState } from 'react';
import { imageSrc } from '../api/client';
import SoldStamp from './SoldStamp';

interface ProductGalleryProps {
  name: string;
  // la API guarda hoy una sola foto por anuncio; la galería ya admite varias
  images: string[];
  sold: boolean;
}

export default function ProductGallery({ name, images, sold }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const hasPhoto = images.length > 0 && !failed.has(current);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-[520px] overflow-hidden rounded-2xl border-[1.5px] border-line bg-sheet">
        {hasPhoto ? (
          <img
            src={imageSrc(images[current])}
            alt={name}
            onError={() => setFailed((previous) => new Set(previous).add(current))}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="halftone h-full" role="img" aria-label={`Sin foto de ${name}`} />
        )}
        {sold && <SoldStamp size="large" />}
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3" aria-label="Fotos del anuncio">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Ver foto ${index + 1}`}
                aria-current={index === current}
                className={`block h-[120px] w-full overflow-hidden rounded-xl border-[1.5px] ${index === current ? 'border-violet' : 'border-line hover:border-ink-faint'}`}
              >
                <img src={imageSrc(image)} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
