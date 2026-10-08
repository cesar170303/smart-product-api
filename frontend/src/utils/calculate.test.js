import { describe, it, expect } from 'vitest';
import { calculate } from './calculate';

describe('calculate', () => {
  it('devuelve 0 cuando el carrito está vacío', () => {
    // Arrange
    const items = [];

    // Act
    const total = calculate(items);

    // Assert
    expect(total).toBe(0);
  });

  it('multiplica price por quantity con un solo item', () => {
    // Arrange
    const items = [{ price: 10, quantity: 3 }];

    // Act
    const total = calculate(items);

    // Assert
    expect(total).toBe(30);
  });

  it('suma price * quantity de varios items', () => {
    // Arrange
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 4 },
      { price: 1.5, quantity: 2 },
    ];

    // Act
    const total = calculate(items);

    // Assert
    expect(total).toBe(43);
  });

  it('ignora los items con quantity 0', () => {
    // Arrange
    const items = [
      { price: 100, quantity: 0 },
      { price: 7, quantity: 1 },
    ];

    // Act
    const total = calculate(items);

    // Assert
    expect(total).toBe(7);
  });

  it('maneja decimales sin errores de coma flotante visibles', () => {
    // Arrange
    const items = [
      { price: 0.1, quantity: 1 },
      { price: 0.2, quantity: 1 },
    ];

    // Act
    const total = calculate(items);

    // Assert
    expect(total).toBeCloseTo(0.3);
  });

  it('lanza un error si algún price es negativo', () => {
    // Arrange
    const items = [
      { price: 10, quantity: 1 },
      { price: -5, quantity: 2 },
    ];

    // Act + Assert (toThrow necesita recibir la función sin ejecutar)
    expect(() => calculate(items)).toThrow('El precio no puede ser negativo');
  });

  it('lanza un error si alguna quantity es negativa', () => {
    // Arrange
    const items = [
      { price: 10, quantity: 1 },
      { price: 5, quantity: -1 },
    ];

    // Act + Assert (toThrow necesita recibir la función sin ejecutar)
    expect(() => calculate(items)).toThrow('La cantidad no puede ser negativa');
  });
});
