import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, createProduct, getProducts, uploadImage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import BackToListing from '../components/BackToListing';
import FormAlert from '../components/FormAlert';
import ListingPreview from '../components/ListingPreview';
import PageShell from '../components/PageShell';
import PhotoField from '../components/PhotoField';
import { PRIMARY_BUTTON } from '../components/styles';
import TextField from '../components/TextField';
import { formatPrice } from '../utils/format';
import { loginPath } from '../utils/routes';
import type { PublishedInfo } from '../utils/published';
import {
  parsePrice,
  validateImageFile,
  validateProduct,
  type FieldErrors,
  type ProductField,
  type ProductValues,
} from '../utils/validation';

const NETWORK_ERROR = 'No hemos podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
const HTTP_UNAUTHORIZED = 401;
const HTTP_TOO_LARGE = 413;
const HTTP_UNSUPPORTED = 415;
const DESCRIPTION_MAX = 5000;
const FIELD_ORDER: ProductField[] = ['photo', 'name', 'description', 'price', 'category'];
// a qué elemento va el cursor cuando falla cada campo
const FOCUS_ID: Record<ProductField, string> = {
  photo: 'photo-button',
  name: 'product-name',
  description: 'product-description',
  price: 'product-price',
  category: 'product-category',
};

type Step = 'idle' | 'uploading' | 'publishing';

// Categorías que ya existen, para sugerirlas al escribir. Si no se pueden pedir, el campo sigue siendo libre.
function useCategorySuggestions(): string[] {
  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    getProducts({ signal: controller.signal })
      .then((products) => {
        const unique = [...new Set(products.map((product) => product.category.name))];
        setNames(unique.sort((a, b) => a.localeCompare(b, 'es')));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return names;
}

export default function UploadPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const suggestions = useCategorySuggestions();

  const [values, setValues] = useState<ProductValues>({ name: '', description: '', price: '', category: '' });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors<ProductField>>({});
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [attempted, setAttempted] = useState(false);
  // Si la foto ya se subió pero el anuncio falló, al reintentar no se vuelve a subir la misma
  const uploaded = useRef<{ file: File; url: string } | null>(null);

  const price = parsePrice(values.price);
  const sending = step !== 'idle';

  const revalidate = (nextValues: ProductValues, nextFile: File | null) => {
    if (attempted) setErrors(validateProduct(nextValues, nextFile !== null));
  };

  const update = (field: keyof ProductValues, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    revalidate(nextValues, file);
  };

  const selectFile = (selected: File | null) => {
    if (selected) {
      const problem = validateImageFile(selected);
      if (problem) {
        setErrors((current) => ({ ...current, photo: problem }));
        return;
      }
    }
    setFile(selected);
    revalidate(values, selected);
    if (selected) setErrors((current) => ({ ...current, photo: undefined }));
  };

  const photoUndecodable = () => {
    setFile(null);
    setErrors((current) => ({ ...current, photo: 'Ese archivo no se puede mostrar como imagen. Elige otra foto.' }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setAttempted(true);

    const found = validateProduct(values, file !== null);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(FOCUS_ID[firstInvalid])?.focus();
      return;
    }
    if (!token || !file || price === null) return;

    try {
      setStep('uploading');
      let imageUrl = uploaded.current?.file === file ? uploaded.current.url : null;
      if (!imageUrl) {
        imageUrl = await uploadImage(file, token);
        uploaded.current = { file, url: imageUrl };
      }

      setStep('publishing');
      const category = values.category.trim();
      const product = await createProduct(
        {
          name: values.name.trim(),
          description: values.description.trim(),
          price,
          image_url: imageUrl,
          // vacía -> la categoría la propone la IA
          category: category || null,
        },
        token,
      );
      const published: PublishedInfo = { aiCategory: !category };
      navigate(`/producto/${product.id}`, { state: { published } });
    } catch (caught) {
      setStep('idle');
      if (caught instanceof ApiError && caught.status === HTTP_UNAUTHORIZED) {
        // La sesión caducó mientras rellenabas el formulario
        logout();
        navigate(loginPath('/subir'), { replace: true });
        return;
      }
      if (caught instanceof ApiError && (caught.status === HTTP_TOO_LARGE || caught.status === HTTP_UNSUPPORTED)) {
        uploaded.current = null;
        setErrors((current) => ({ ...current, photo: caught.message }));
        document.getElementById(FOCUS_ID.photo)?.focus();
        return;
      }
      setFormError(caught instanceof ApiError ? caught.message : NETWORK_ERROR);
    }
  };

  const buttonLabel = { idle: 'Publicar producto', uploading: 'Subiendo la foto…', publishing: 'Publicando…' }[step];

  return (
    <PageShell search={<BackToListing />}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(340px,400px)] items-start gap-14 pt-2">
        <form onSubmit={submit} noValidate className="flex max-w-[720px] flex-col gap-6">
          <h1 className="font-display text-[40px] leading-tight font-extrabold tracking-[-0.02em]">Subir producto</h1>

          <PhotoField file={file} error={errors.photo} onSelect={selectFile} />

          <TextField
            id="product-name"
            label="Nombre"
            value={values.name}
            onChange={(value) => update('name', value)}
            error={errors.name}
            maxLength={150}
            hint="Lo que buscaría quien lo quiere: «Bicicleta urbana 28 pulgadas»."
          />
          <TextField
            id="product-description"
            label="Descripción"
            multiline
            rows={5}
            value={values.description}
            onChange={(value) => update('description', value)}
            error={errors.description}
            maxLength={DESCRIPTION_MAX}
            hint={`Estado, medidas, defectos, si incluye cargador… ${values.description.length}/${DESCRIPTION_MAX}`}
          />

          <div className="grid grid-cols-2 gap-5">
            <TextField
              id="product-price"
              label="Precio"
              inputMode="decimal"
              suffix="€"
              value={values.price}
              onChange={(value) => update('price', value)}
              error={errors.price}
              hint="En euros, por ejemplo 45 o 45,50. Se publica tal cual lo escribes."
            />
            <TextField
              id="product-category"
              label="Categoría"
              optional
              list="category-options"
              value={values.category}
              onChange={(value) => update('category', value)}
              error={errors.category}
              maxLength={50}
              hint="Si la dejas vacía, la IA elige una según el nombre."
            />
            <datalist id="category-options">
              {suggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          {formError && <FormAlert>{formError}</FormAlert>}

          <button type="submit" disabled={sending} className={`h-14 w-full text-lg ${PRIMARY_BUTTON}`}>
            {buttonLabel}
          </button>
        </form>

        <aside aria-label="Vista previa del anuncio" className="sticky top-8">
          <h2 className="mb-4 font-display text-xl font-extrabold">Así se verá en el listado</h2>
          <ListingPreview
            file={file}
            name={values.name}
            price={price !== null ? formatPrice(price) : null}
            category={values.category}
            onUndecodable={photoUndecodable}
          />
          <p className="mt-3 text-sm text-ink-faint">Una muestra: si dejas la categoría vacía, la IA la elige al publicar.</p>
        </aside>
      </div>
    </PageShell>
  );
}
