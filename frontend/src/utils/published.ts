// Lo que el formulario de subida le cuenta a la ficha del anuncio recién publicado (viaja en el estado de la navegación)
export interface PublishedInfo {
  // el precio que escribió el vendedor, antes de la regla de la categoría
  requestedPrice: number;
  // la categoría la eligió la IA porque el vendedor la dejó vacía
  aiCategory: boolean;
}
