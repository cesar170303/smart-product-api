// Tipos que devuelve la API (backend/models). Reflejan ProductRead, CategoryRead y SellerRead.

export type ProductStatus = 'available' | 'reserved' | 'sold';

export interface Category {
  id: number;
  name: string;
}

export interface Seller {
  id: number;
  name: string;
  location: string | null;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  buyer_id: number;
  status: OrderStatus;
  created_at: string;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  status: ProductStatus;
  created_at: string;
  category: Category;
  seller: Seller;
}

// Chat: una conversación es un producto más un comprador (el vendedor es siempre el dueño del producto)
export interface Participant {
  id: number;
  name: string;
}

export interface Message {
  id: number;
  product_id: number;
  buyer_id: number;
  sender_id: number;
  body: string;
  created_at: string;
  sender: Participant;
}

export interface Conversation {
  product: Pick<Product, 'id' | 'name' | 'price' | 'image_url' | 'status'>;
  buyer_id: number;
  // la otra persona: el comprador si el producto es tuyo, el vendedor si no
  other: Participant;
  last_message: Message;
}
