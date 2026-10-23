import type { Product } from './api/types';

// Token de pega: el frontend solo lee el payload, la firma no se comprueba (eso lo hace el backend)
export function fakeToken(payload: object): string {
  const encode = (value: object) => btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.firma`;
}

const ONE_HOUR_SECONDS = 3600;

// Sesión iniciada como el usuario `userId`, con el token en sessionStorage como hace la app
export function signInAs(userId: number): string {
  const token = fakeToken({ sub: String(userId), exp: Math.floor(Date.now() / 1000) + ONE_HOUR_SECONDS });
  sessionStorage.setItem('access_token', token);
  return token;
}

export const exampleProduct: Product = {
  id: 7,
  name: 'iPhone 12 128GB',
  description: 'Funciona perfectamente.\nIncluye cargador.',
  price: 290,
  image_url: '/media/0123456789abcdef0123456789abcdef.png',
  status: 'available',
  created_at: '2026-10-20T10:00:00Z',
  category: { id: 1, name: 'Tecnología' },
  seller: { id: 2, name: 'Laura M.', location: 'Alcalá de Henares' },
};
