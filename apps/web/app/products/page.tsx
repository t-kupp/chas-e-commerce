import { Metadata } from "next";
import ProductGrid from "../components/ProductGrid";

export const metadata: Metadata = {
  title: "All Pokemon Cards",
  description:
    "Browse our complete collection of authentic Pokemon trading cards. Find rare, holographic, and collectible cards from all generations.",
  openGraph: {
    title: "All Pokemon Cards | Pokemon Cards Store",
    description:
      "Browse our complete collection of authentic Pokemon trading cards.",
    url: "http://localhost:3000/products",
  },
  alternates: {
    canonical: "http://localhost:3000/products",
  },
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Pokemon Cards</h1>
      <ProductGrid />
    </div>
  );
}
