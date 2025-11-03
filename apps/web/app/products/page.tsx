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

async function getAllPokemon(searchQuery?: string) {
  try {
    let url = "http://localhost:1337/api/pokemons?populate=*";

    if (searchQuery) {
      url += `&filters[name][$containsi]=${encodeURIComponent(searchQuery)}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching pokemon:", error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q;
  const pokemon = await getAllPokemon(searchQuery);

  console.log("Search query:", searchQuery);
  console.log("Pokemon found:", pokemon.length);

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
        <h1 className="text-4xl font-bold mb-4">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "All Pokemon Cards"}
        </h1>

        {searchQuery && (
          <p className="text-gray-600 mb-8">
            Found {pokemon.length} {pokemon.length === 1 ? "card" : "cards"}
          </p>
        )}

        {pokemon.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {searchQuery
                ? `No Pokemon cards found matching "${searchQuery}"`
                : "No Pokemon cards available"}
            </p>
            {searchQuery && (
              <Link
                href="/products"
                className="text-blue-600 hover:underline mt-4 inline-block"
              >
                View all products
              </Link>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}
