/**
 * @typedef {Object} CartItem
 * @property {number} price
 * @property {number} quantity
 */

/**
 * Calcula el total del carrito: suma de price * quantity de cada item.
 * @param {CartItem[]} items
 * @returns {number}
 * @throws {Error} Si algún item tiene price o quantity negativos.
 */
export function calculate(items) {
  return items.reduce((total, item) => {
    if (item.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    if (item.quantity < 0) {
      throw new Error('La cantidad no puede ser negativa');
    }
    return total + item.price * item.quantity;
  }, 0);
}
