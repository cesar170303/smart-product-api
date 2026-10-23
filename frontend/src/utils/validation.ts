// Mismas reglas que el backend (models/User.py), para avisar antes de enviar y no gastar un intento de login.
// El backend sigue validando todo: esto solo mejora la experiencia.
const NAME_MIN = 2;
const NAME_MAX = 100;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;
const LOCATION_MAX = 100;

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

// algo@dominio.ext, sin espacios (misma idea que el backend, sin expresiones regulares costosas)
export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (email.includes(' ')) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  const dot = domain.lastIndexOf('.');
  return local.length > 0 && dot > 0 && dot < domain.length - 1;
}

export interface LoginValues {
  email: string;
  password: string;
}

export function validateLogin({ email, password }: LoginValues): FieldErrors<keyof LoginValues> {
  const errors: FieldErrors<keyof LoginValues> = {};
  if (!email.trim()) errors.email = 'Escribe tu email.';
  else if (!isValidEmail(email)) errors.email = 'El email no tiene un formato válido (por ejemplo, ana@correo.com).';
  if (!password) errors.password = 'Escribe tu contraseña.';
  return errors;
}

export interface RegisterValues extends LoginValues {
  name: string;
  location: string;
}

export function validateRegister(values: RegisterValues): FieldErrors<keyof RegisterValues> {
  const errors: FieldErrors<keyof RegisterValues> = {};
  const name = values.name.trim();
  if (name.length < NAME_MIN) errors.name = `Escribe tu nombre (mínimo ${NAME_MIN} letras).`;
  else if (name.length > NAME_MAX) errors.name = `El nombre no puede pasar de ${NAME_MAX} caracteres.`;

  if (!values.email.trim()) errors.email = 'Escribe tu email.';
  else if (!isValidEmail(values.email)) errors.email = 'El email no tiene un formato válido (por ejemplo, ana@correo.com).';

  if (values.password.length < PASSWORD_MIN) errors.password = `La contraseña necesita al menos ${PASSWORD_MIN} caracteres.`;
  else if (values.password.length > PASSWORD_MAX) errors.password = `La contraseña no puede pasar de ${PASSWORD_MAX} caracteres.`;

  if (values.location.trim().length > LOCATION_MAX) errors.location = `La ciudad no puede pasar de ${LOCATION_MAX} caracteres.`;
  return errors;
}

const PRODUCT_NAME_MIN = 3;
const PRODUCT_NAME_MAX = 150;
const DESCRIPTION_MAX = 5000;
const CATEGORY_MAX = 50;
const PRICE_PATTERN = /^\d{1,9}(\.\d{1,2})?$/;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// "45", "45,5" y "45.50" valen; "abc", "-3", "1.234,50" o tres decimales no. Devuelve el número o null.
export function parsePrice(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (!PRICE_PATTERN.test(normalized)) return null;
  const value = Number(normalized);
  return value > 0 ? value : null;
}

// Aviso sobre un archivo de foto antes de subirlo (el backend lo vuelve a comprobar)
export function validateImageFile(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'La foto tiene que ser JPG, PNG o WEBP.';
  if (file.size > MAX_IMAGE_BYTES) return 'La foto no puede pasar de 5 MB.';
  return null;
}

export interface ProductValues {
  name: string;
  description: string;
  price: string;
  category: string;
}

export type ProductField = keyof ProductValues | 'photo';

export function validateProduct(values: ProductValues, hasPhoto: boolean): FieldErrors<ProductField> {
  const errors: FieldErrors<ProductField> = {};
  if (!hasPhoto) errors.photo = 'Elige una foto del producto.';

  const name = values.name.trim();
  if (name.length < PRODUCT_NAME_MIN) errors.name = `Ponle un nombre (mínimo ${PRODUCT_NAME_MIN} letras).`;
  else if (name.length > PRODUCT_NAME_MAX) errors.name = `El nombre no puede pasar de ${PRODUCT_NAME_MAX} caracteres.`;

  const description = values.description.trim();
  if (!description) errors.description = 'Cuenta cómo está el producto: estado, medidas, defectos…';
  else if (description.length > DESCRIPTION_MAX) errors.description = `La descripción no puede pasar de ${DESCRIPTION_MAX} caracteres.`;

  if (!values.price.trim()) errors.price = 'Indica el precio.';
  else if (parsePrice(values.price) === null) errors.price = 'Escribe un precio válido en euros, por ejemplo 45 o 45,50.';

  if (values.category.trim().length > CATEGORY_MAX) errors.category = `La categoría no puede pasar de ${CATEGORY_MAX} caracteres.`;
  return errors;
}

// Solo se vuelve a rutas de dentro de la app: "/producto/3" sí; "https://otra.web" o "//otra.web" no
export function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return '/';
  return raw;
}

// Frase para decir por qué se pide cuenta, según a dónde quería ir la persona
export function reasonFor(next: string): string {
  if (next.startsWith('/producto/')) return 'comprar este artículo o hablar con quien lo vende';
  if (next.startsWith('/chat/')) return 'hablar con el vendedor';
  if (next.startsWith('/subir')) return 'subir tu producto y ponerlo a la venta';
  if (next.startsWith('/mis-ventas')) return 'ver y gestionar tus ventas';
  return 'comprar, chatear con vendedores o subir tus propios productos';
}
