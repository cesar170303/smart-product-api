import type { Conversation, Message, Order, Product } from './types';

// Se puede cambiar con VITE_API_URL (en frontend/.env.local, por ejemplo); si no, se usa el backend local
const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface ValidationDetail {
  loc?: (string | number)[];
  msg: string;
}

interface ErrorBody {
  mensaje?: string;
  'detalles: '?: ValidationDetail[];
}

// Error de la API con el código HTTP, para poder reaccionar a un 401 o un 429
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// La API devuelve los errores como { mensaje: "..." } (y en los 422 una lista de detalles en la clave "detalles: ")
async function buildError(response: Response): Promise<ApiError> {
  let message = `Error ${response.status}`;
  try {
    const body: ErrorBody = await response.json();
    if (body.mensaje) message = body.mensaje;
    const details = body['detalles: '];
    if (Array.isArray(details) && details.length > 0) {
      message += ': ' + details.map((detail) => `${detail.loc?.slice(1).join('.')} ${detail.msg}`).join('; ');
    }
  } catch {
    // la respuesta no era JSON: nos quedamos con el mensaje genérico
  }
  return new ApiError(message, response.status);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    throw await buildError(response);
  }
  return response.json() as Promise<T>;
}

function bearer(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// Las fotos se guardan como ruta relativa (/media/abc.png); para mostrarlas hay que apuntar al servidor de la API
export function imageSrc(path: string | null | undefined): string {
  return path ? `${API_BASE_URL}${path}` : '';
}

export function getProducts(signal?: AbortSignal): Promise<Product[]> {
  return request<Product[]>('/products', { signal });
}

export function getProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return request<Product>(`/products/${id}`, { signal });
}

// El login es un formulario OAuth2: el campo "username" lleva el email
export function loginUser(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
}

// A diferencia del login (formulario), /register recibe un JSON
export function registerUser(name: string, email: string, password: string, location?: string) {
  return request<{ mensaje: string; usuario: { id: number; name: string; email: string } }>('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, location: location || null }),
  });
}

// Sube la foto y devuelve su ruta (/media/<uuid>.<ext>), que luego se manda en image_url al crear el producto
export async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  // OJO: aquí NO se pone Content-Type. El navegador lo añade solo, con el "boundary" que necesita el multipart.
  const data = await request<{ image_url: string }>('/uploads', {
    method: 'POST',
    headers: bearer(token),
    body: formData,
  });
  return data.image_url;
}

// Comprar crea un pedido pendiente y el producto pasa a reservado ("Pendiente de envío")
export function createOrder(productId: number, token: string): Promise<Order> {
  return request<Order>('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...bearer(token) },
    body: JSON.stringify({ product_id: productId }),
  });
}

// Pedidos en los que participa la persona con sesión: como comprador o como vendedor del producto
export function getOrders(token: string, signal?: AbortSignal): Promise<Order[]> {
  return request<Order[]>('/orders', { headers: bearer(token), signal });
}

// El vendedor completa el pedido (el producto pasa a "Vendido") o cualquiera de las dos partes lo cancela
// (el producto vuelve a "En venta"). Los dos estados son finales: no se pueden deshacer.
export function updateOrderStatus(orderId: number, status: 'completed' | 'cancelled', token: string): Promise<Order> {
  return request<Order>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...bearer(token) },
    body: JSON.stringify({ status }),
  });
}

// Bandeja de entrada: una fila por conversación, con el último mensaje
export function getConversations(token: string, signal?: AbortSignal): Promise<Conversation[]> {
  return request<Conversation[]>('/conversations', { headers: bearer(token), signal });
}

interface MessagesQuery {
  // solo lo usa el vendedor, para decir con qué comprador habla
  buyerId?: number | null;
  // pide únicamente los mensajes posteriores a este id (el chat consulta las novedades cada pocos segundos)
  afterId?: number;
  signal?: AbortSignal;
}

export function getMessages(productId: number, token: string, { buyerId, afterId, signal }: MessagesQuery = {}): Promise<Message[]> {
  const params = new URLSearchParams();
  if (buyerId) params.set('buyer_id', String(buyerId));
  if (afterId) params.set('after_id', String(afterId));
  const query = params.size > 0 ? `?${params}` : '';
  return request<Message[]>(`/products/${productId}/messages${query}`, { headers: bearer(token), signal });
}

export function sendMessage(productId: number, body: string, token: string, buyerId?: number | null): Promise<Message> {
  return request<Message>(`/products/${productId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...bearer(token) },
    body: JSON.stringify({ body, buyer_id: buyerId ?? null }),
  });
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string | null;
}

export function createProduct(product: NewProduct, token: string): Promise<Product> {
  return request<Product>('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...bearer(token) },
    body: JSON.stringify(product),
  });
}
