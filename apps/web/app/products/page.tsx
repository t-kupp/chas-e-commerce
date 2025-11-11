import { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import ProductsPageClient from "./ProductsPageClient";

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
      <ProductsPageClient />
    </div>
  );
}
