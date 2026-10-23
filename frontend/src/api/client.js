// Se puede cambiar con VITE_API_URL (en frontend/.env.local, por ejemplo); si no, se usa el backend local
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// La API devuelve los errores como { mensaje: "..." } (y en los 422 una lista de detalles en la clave "detalles: ")
async function buildError(response) {
  let message = `Error ${response.status}`;
  try {
    const body = await response.json();
    if (body.mensaje) message = body.mensaje;
    const details = body['detalles: '];
    if (Array.isArray(details) && details.length > 0) {
      message += ': ' + details.map((detail) => `${detail.loc?.slice(1).join('.')} ${detail.msg}`).join('; ');
    }
  } catch {
    // la respuesta no era JSON: nos quedamos con el mensaje genérico
  }
  const error = new Error(message);
  error.status = response.status;
  return error;
}

// Las fotos se guardan como ruta relativa (/media/abc.png); para mostrarlas hay que apuntar al servidor de la API
export function imageSrc(path) {
  return path ? `${API_BASE_URL}${path}` : '';
}

export async function loginUser(endpoint, username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/X-www-form-urlencoded',
    },
    body: formData
  });

  if (!response.ok) {
    throw await buildError(response);
  }

  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw await buildError(response);
  }

  return response.json();
}

// Sube la foto y devuelve su ruta (/media/<uuid>.<ext>), que luego se manda en image_url al crear el producto
export async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    // OJO: aquí NO se pone Content-Type. El navegador lo añade solo, con el "boundary" que necesita el multipart.
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    throw await buildError(response);
  }

  const data = await response.json();
  return data.image_url;
}

export async function createProduct(product, token) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw await buildError(response);
  }

  return response.json();
}
