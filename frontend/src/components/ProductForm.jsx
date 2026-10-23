import { useEffect, useRef, useState } from 'react';
import { createProduct, uploadImage } from '../api/client.js';

// Mismo límite que la API (5 MB). Aquí solo sirve para avisar antes de subir; la API lo vuelve a comprobar.
const MAX_IMAGE_MB = 5;
const BYTES_PER_MB = 1048576;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * BYTES_PER_MB;
const HTTP_UNAUTHORIZED = 401;
const PREVIEW_MAX_WIDTH = 320;

const inputClass = 'w-full bg-slate-800 p-3 rounded-xl border border-slate-700';

export default function ProductForm({ token, onCreated, onUnauthorized }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  // Un <input type="file"> no se puede vaciar desde React; cambiando su "key" se vuelve a crear en blanco
  const [fileInputKey, setFileInputKey] = useState(0);
  const previewCanvasRef = useRef(null);

  // La vista previa se dibuja en un <canvas> a partir del archivo, sin crear ninguna URL que se inserte en el HTML.
  // Si el navegador no puede decodificarlo, no es una foto de verdad y se descarta antes de subirlo.
  useEffect(() => {
    if (!file) return undefined;

    let ignore = false;

    createImageBitmap(file)
      .then((bitmap) => {
        const canvas = previewCanvasRef.current;
        if (ignore || !canvas) {
          bitmap.close();
          return;
        }
        const scale = Math.min(1, PREVIEW_MAX_WIDTH / bitmap.width);
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
      })
      .catch(() => {
        if (ignore) return;
        setError('Ese archivo no se puede mostrar como imagen. Elige otra foto.');
        setFile(null);
        setFileInputKey((key) => key + 1);
      });

    return () => {
      ignore = true;
    };
  }, [file]);

  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    setError('');

    if (!selected) {
      setFile(null);
      return;
    }

    if (selected.size > MAX_IMAGE_BYTES) {
      setError(`La imagen no puede superar ${MAX_IMAGE_MB} MB`);
      setFile(null);
      setFileInputKey((key) => key + 1);
      return;
    }

    setFile(selected);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setFile(null);
    setFileInputKey((key) => key + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!file) {
      setError('Elige una foto del producto');
      return;
    }

    setSending(true);
    try {
      // Paso 1: subir la foto y obtener su ruta. Paso 2: crear el producto con esa ruta.
      const imageUrl = await uploadImage(file, token);
      const product = await createProduct(
        {
          name,
          description,
          price: Number(price),
          image_url: imageUrl,
          category: category.trim() || null, // vacía -> la categoría la propone la IA
        },
        token,
      );
      onCreated(product);
      resetForm();
    } catch (err) {
      if (err.status === HTTP_UNAUTHORIZED) {
        onUnauthorized();
        return;
      }
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
      <h2 className="font-bold text-xl">Nuevo producto</h2>

      <input className={inputClass} type="text" placeholder="Título" required minLength={3} maxLength={150}
        value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className={inputClass} placeholder="Descripción" required rows={3} maxLength={5000}
        value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex gap-3">
        <input className={inputClass} type="number" placeholder="Precio (€)" required min="0.01" step="0.01"
          value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className={inputClass} type="text" placeholder="Categoría (opcional)" maxLength={50}
          value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-300">
        Foto del producto (JPG, PNG o WEBP, máx. 5 MB)
        <input key={fileInputKey} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange}
          className="file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-sky-700" />
      </label>

      {file && (
        <canvas ref={previewCanvasRef} role="img" aria-label="Vista previa de la foto elegida"
          className="max-w-xs rounded-xl border border-slate-700" />
      )}

      {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}

      <button type="submit" disabled={sending}
        className="bg-sky-500 hover:bg-sky-700 disabled:opacity-50 text-white font-bold p-3 rounded-xl border border-sky-700">
        {sending ? 'Publicando…' : 'Publicar producto'}
      </button>
    </form>
  );
}
