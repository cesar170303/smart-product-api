interface TokenPayload {
  sub?: string;
  exp?: number;
}

const MS_PER_SECOND = 1000;

function readPayload(token: string): TokenPayload | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    // el payload va en base64url: se pasa a base64 normal antes de decodificar
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as TokenPayload;
  } catch {
    return null;
  }
}

// Id del usuario del token, o null si el token no se puede leer o ya ha caducado.
// OJO: solo sirve para decidir qué mostrar (por ejemplo ocultar "Comprar" en tu propio anuncio).
// La seguridad real la pone el backend, que valida la firma en cada petición.
export function getUserIdFromToken(token: string | null, now: number = Date.now()): number | null {
  if (!token) return null;
  const payload = readPayload(token);
  if (!payload?.sub) return null;
  if (typeof payload.exp === 'number' && payload.exp * MS_PER_SECOND <= now) return null;
  const id = Number(payload.sub);
  return Number.isInteger(id) ? id : null;
}

// Momento (en milisegundos) en que caduca el token, o null si no se puede leer o no trae caducidad.
// Sirve para cerrar la sesión en el momento justo, sin esperar a que una petición devuelva 401.
export function getTokenExpiry(token: string | null): number | null {
  if (!token) return null;
  const payload = readPayload(token);
  return typeof payload?.exp === 'number' ? payload.exp * MS_PER_SECOND : null;
}
