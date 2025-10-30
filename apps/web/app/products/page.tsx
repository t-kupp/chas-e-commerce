import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Pokemon Cards",
  description:
    "Browse our complete collection of authentic Pokemon trading cards. Find rare, holographic, and collectible cards from all generations.",
  openGraph: {
    title: "All Pokemon Cards | Pokemon Cards Store",
    description:
      "Browse our complete collection of authentic Pokemon trading cards.",
    url: "https://chas-e-commerce-web.vercel.app/products",
  },
  alternates: {
    canonical: "https://chas-e-commerce-web.vercel.app/products",
  },
};

async function getAllPokemon() {
  try {
    const res = await fetch("http://localhost:1337/api/pokemons?populate=*", {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching pokemon:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const pokemon = await getAllPokemon();

  return (
    <div>
      <h1>All Pokemon Cards</h1>
      <p>
        Browse our complete collection of authentic Pokemon trading cards. Find
        rare, holographic, and collectible cards from all generations.
      </p>
      <Link href="/">Back to Home</Link>
    </div>
  );
}
