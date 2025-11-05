import { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "../components/ProductGrid";
import PageHeader from "../components/PageHeader";

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
    <div>
      <PageHeader
        title="All Pokemon Cards"
        description="Browse our complete collection of authentic Pokemon trading cards."
      />
      <div className="container mx-auto px-4 py-8">
        <ProductGrid />
      </div>
    </div>
  );
}
