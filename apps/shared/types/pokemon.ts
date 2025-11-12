interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Type {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Condition {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Rarity {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Pokemon {
  id: number;
  documentId: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  slug: string;
  stock: number | null;
  description?: string;
  image: Image;
  type: Type;
  condition: Condition;
  rarity: Rarity;
}

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
};

export type CartContextType = {
  total: number;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  increaseItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
};

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | null;

export interface FilterState {
  priceRange: { min: number; max: number };
  types: string[];
  rarities: string[];
  conditions: string[];
  inStock: boolean | null;
  name: string;
}

export interface FilterOptions {
  types: Array<{ id: number; title: string }>;
  rarities: Array<{ id: number; title: string }>;
  conditions: Array<{ id: number; title: string }>;
  priceRange: { min: number; max: number };
}
