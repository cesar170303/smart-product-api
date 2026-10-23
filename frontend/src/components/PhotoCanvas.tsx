import { useEffect, useRef } from 'react';

const MAX_PREVIEW_WIDTH = 900;

interface PhotoCanvasProps {
  file: File;
  label: string;
  // el navegador no pudo decodificar el archivo: no es una foto de verdad
  onUndecodable: () => void;
}

// Dibuja la foto elegida en un <canvas>, sin crear ninguna URL que se inserte en el HTML (decisión de seguridad
// del formulario anterior). Si el navegador no puede decodificarla, avisa para descartarla antes de subirla.
export default function PhotoCanvas({ file, label, onUndecodable }: PhotoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // guardamos la función en una referencia para no volver a decodificar si el padre se vuelve a renderizar
  const onUndecodableRef = useRef(onUndecodable);
  useEffect(() => {
    onUndecodableRef.current = onUndecodable;
  });

  useEffect(() => {
    // Navegadores o entornos sin createImageBitmap: se omite la vista previa, la subida sigue funcionando
    if (typeof createImageBitmap !== 'function') return;

    let ignore = false;
    createImageBitmap(file)
      .then((bitmap) => {
        const canvas = canvasRef.current;
        if (ignore || !canvas) {
          bitmap.close();
          return;
        }
        const scale = Math.min(1, MAX_PREVIEW_WIDTH / bitmap.width);
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
      })
      .catch(() => {
        if (!ignore) onUndecodableRef.current();
      });

    return () => {
      ignore = true;
    };
  }, [file]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className="h-full w-full object-cover" />;
}
