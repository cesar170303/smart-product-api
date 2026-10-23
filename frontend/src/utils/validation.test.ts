import { describe, expect, it } from 'vitest';
import {
  isValidEmail,
  parsePrice,
  reasonFor,
  safeNext,
  validateImageFile,
  validateLogin,
  validateProduct,
  validateRegister,
} from './validation';

describe('parsePrice', () => {
  it.each([
    ['45', 45],
    ['45,5', 45.5],
    ['45.50', 45.5],
    [' 0,99 ', 0.99],
  ])('acepta "%s" como %s', (text, expected) => {
    expect(parsePrice(text)).toBe(expected);
  });

  it.each(['', 'abc', '-3', '0', '0,00', '1.234,50', '12,345', '12 €', '1e3'])('rechaza "%s"', (text) => {
    expect(parsePrice(text)).toBeNull();
  });
});

describe('validateImageFile', () => {
  const file = (type: string, size: number) => new File([new Uint8Array(size)], 'foto', { type });

  it('acepta JPG, PNG y WEBP de hasta 5 MB', () => {
    expect(validateImageFile(file('image/jpeg', 10))).toBeNull();
    expect(validateImageFile(file('image/png', 5 * 1024 * 1024))).toBeNull();
    expect(validateImageFile(file('image/webp', 10))).toBeNull();
  });

  it('rechaza otros formatos y archivos de más de 5 MB', () => {
    expect(validateImageFile(file('image/gif', 10))).toContain('JPG, PNG o WEBP');
    expect(validateImageFile(file('application/pdf', 10))).not.toBeNull();
    expect(validateImageFile(file('image/png', 5 * 1024 * 1024 + 1))).toContain('5 MB');
  });
});

describe('validateProduct', () => {
  const valid = { name: 'Bicicleta urbana', description: 'Como nueva', price: '120', category: '' };

  it('acepta un producto correcto con la categoría vacía', () => {
    expect(validateProduct(valid, true)).toEqual({});
  });

  it('exige foto, nombre de 3 letras, descripción y precio válido', () => {
    const errors = validateProduct({ name: 'ab', description: '  ', price: 'gratis', category: '' }, false);
    expect(Object.keys(errors).sort()).toEqual(['description', 'name', 'photo', 'price']);
  });

  it('limita la categoría a 50 caracteres', () => {
    expect(validateProduct({ ...valid, category: 'x'.repeat(51) }, true).category).toBeDefined();
  });
});

describe('isValidEmail', () => {
  it.each(['ana@correo.com', ' ana@correo.com ', 'a.b+c@sub.dominio.es'])('acepta %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(['', 'ana', 'ana@', '@correo.com', 'ana@correo', 'ana@correo.', 'a b@correo.com', 'a@@correo.com'])(
    'rechaza "%s"',
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );
});

describe('validateLogin', () => {
  it('no avisa si hay email válido y contraseña', () => {
    expect(validateLogin({ email: 'ana@correo.com', password: 'x' })).toEqual({});
  });

  it('avisa de lo que falta', () => {
    const errors = validateLogin({ email: '', password: '' });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});

describe('validateRegister', () => {
  const valid = { name: 'Ana', email: 'ana@correo.com', password: '12345678', location: '' };

  it('acepta unos datos correctos, con la ciudad vacía', () => {
    expect(validateRegister(valid)).toEqual({});
  });

  it('exige nombre de al menos 2 letras', () => {
    expect(validateRegister({ ...valid, name: ' A ' }).name).toBeDefined();
  });

  it('exige contraseña de al menos 8 caracteres (como el backend)', () => {
    expect(validateRegister({ ...valid, password: '1234567' }).password).toContain('8');
    expect(validateRegister({ ...valid, password: '12345678' }).password).toBeUndefined();
  });

  it('limita la ciudad a 100 caracteres', () => {
    expect(validateRegister({ ...valid, location: 'x'.repeat(101) }).location).toBeDefined();
  });
});

describe('safeNext', () => {
  it.each([
    ['/producto/3', '/producto/3'],
    ['/?categoria=Hogar', '/?categoria=Hogar'],
    [null, '/'],
    ['', '/'],
    ['https://otra.web', '/'],
    ['//otra.web', '/'],
    ['/\\otra.web', '/'],
    ['javascript:alert(1)', '/'],
  ])('%s -> %s', (raw, expected) => {
    expect(safeNext(raw)).toBe(expected);
  });
});

describe('reasonFor', () => {
  it('explica por qué se pide cuenta según el destino', () => {
    expect(reasonFor('/producto/7')).toContain('comprar');
    expect(reasonFor('/subir')).toContain('subir');
    expect(reasonFor('/')).toContain('comprar, chatear');
  });
});
