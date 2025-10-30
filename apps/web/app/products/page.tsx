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
    url: "http://localhost:3000/products",
  },
  alternates: {
    canonical: "http://localhost:3000/products",
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

  // JSON-LD for product listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Pokemon Trading Cards",
    itemListElement: pokemon.map((p: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: p.name,
        url: `http://localhost:3000/products/${p.slug}`,
        image: p.image?.url ? `http://localhost:1337${p.image.url}` : "",
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "EUR",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Pokemon Cards</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemon.map((p: any) => {
            const imageUrl = p.image?.url
              ? `http://localhost:1337${p.image.url}`
              : "/placeholder-card.jpg";

            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={imageUrl}
                  alt={p.name}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
                <p className="text-gray-600 mb-2">
                  {p.rarity?.title || "Pokemon Card"}
                </p>
                <p className="text-2xl font-bold text-blue-600">${p.price}</p>
                {p.stock > 0 ? (
                  <p className="text-green-600 text-sm mt-2">In Stock</p>
                ) : (
                  <p className="text-red-600 text-sm mt-2">Out of Stock</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
