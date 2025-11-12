export interface OrderPokemon {
  id: number;
  documentId: string;
  name: string;
  price: number;
  image: {
    url: string;
  };
}

export interface OrderItem {
  id: number;
  pokemon: OrderPokemon;
  Quantity: number;
}

export interface Order {
  id: number;
  documentId: string;
  total: number;
  orderStatus: 'pending' | 'completed' | 'cancelled' | 'shipped';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  orderItems: OrderItem[];
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCount: number;
}