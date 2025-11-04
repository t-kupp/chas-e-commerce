export interface Pokemon {
  id: number;
  name: string;
  price: number;
  stock: number | null;
  documentId: string;
  image?: {
    url: string;
  };
}
