import { describe, expect, it } from 'vitest';
import { fakeToken } from '../testUtils';
import { getTokenExpiry, getUserIdFromToken } from './jwt';

const NOW = Date.UTC(2026, 9, 23, 12, 0, 0);
const IN_ONE_HOUR = NOW / 1000 + 3600;
const ONE_HOUR_AGO = NOW / 1000 - 3600;

describe('getUserIdFromToken', () => {
  it('devuelve el id del usuario (claim sub)', () => {
    expect(getUserIdFromToken(fakeToken({ sub: '7', exp: IN_ONE_HOUR }), NOW)).toBe(7);
  });

  it('trata un token caducado como sesión cerrada', () => {
    expect(getUserIdFromToken(fakeToken({ sub: '7', exp: ONE_HOUR_AGO }), NOW)).toBeNull();
  });

  it.each([null, '', 'basura', 'a.b.c'])('devuelve null con un token inválido (%s)', (token) => {
    expect(getUserIdFromToken(token, NOW)).toBeNull();
  });

  it('devuelve null si sub no es un número', () => {
    expect(getUserIdFromToken(fakeToken({ sub: 'abc', exp: IN_ONE_HOUR }), NOW)).toBeNull();
  });
});

describe('getTokenExpiry', () => {
  it('devuelve cuándo caduca el token, en milisegundos', () => {
    expect(getTokenExpiry(fakeToken({ sub: '7', exp: IN_ONE_HOUR }))).toBe(IN_ONE_HOUR * 1000);
  });

  it('devuelve null si el token no se puede leer o no trae caducidad', () => {
    expect(getTokenExpiry(null)).toBeNull();
    expect(getTokenExpiry('basura')).toBeNull();
    expect(getTokenExpiry(fakeToken({ sub: '7' }))).toBeNull();
  });
});
