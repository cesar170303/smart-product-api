import type { Conversation } from '../api/types';

// Identifica una conversación: el producto más el comprador (el vendedor es siempre el dueño del producto)
export function conversationKey(productId: number, buyerId: number): string {
  return `${productId}-${buyerId}`;
}

// Quien es el comprador de la conversación entra con /chat/:producto; el vendedor, indicando con quién habla
export function conversationPath(conversation: Conversation, userId: number): string {
  const { id } = conversation.product;
  return conversation.buyer_id === userId ? `/chat/${id}` : `/chat/${id}?comprador=${conversation.buyer_id}`;
}
