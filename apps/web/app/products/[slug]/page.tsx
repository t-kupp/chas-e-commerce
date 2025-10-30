import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Pokemon {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  type?: {
    title: string;
    slug: string;
  };
  rarity?: {
    title: string;
  };
  condition?: {
    title: string;
  };
}

// fetch Pokemon data from Strapi
async function getPokemon(slug: string): Promise<Pokemon | null> {
  try {
    const res = await fetch(
      `http://localhost:1337/api/pokemons?filters[slug][$eq]=${slug}&populate=*`,
      {
        next: { revalidate: 60 }, // revalidate every 60 seconds
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    if (!data.data || data.data.length === 0) return null;

    return data.data[0];
  } catch (error) {
    console.error("Error fetching pokemon:", error);
    return null;
  }
}

// generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pokemon = await getPokemon(params.slug);

  if (!pokemon) {
    return {
      title: "Product Not Found",
      description: "This Pokemon card could not be found.",
    };
  }

  const imageUrl = pokemon.image?.url
    ? `http://localhost:1337${pokemon.image.url}`
    : "/placeholder-card.jpg";

  const title = `${pokemon.name} - ${pokemon.rarity?.title || "Pokemon Card"}`;
  const description = `Buy ${pokemon.name} Pokemon card. ${pokemon.condition?.title || "Excellent"} condition, ${pokemon.rarity?.title || "Rare"}. Only $${pokemon.price}. ${pokemon.stock} in stock.`;

  return {
    title,
    description,
    keywords: [
      pokemon.name,
      "pokemon card",
      pokemon.type?.title || "",
      pokemon.rarity?.title || "",
      "trading card",
      "collectible",
      "TCG",
    ].filter(Boolean),

    openGraph: {
      title,
      description,
      type: "website",
      url: `http://localhost:3000/products/${pokemon.slug}`,
      images: [
        {
          url: imageUrl,
          width: pokemon.image?.width || 800,
          height: pokemon.image?.height || 800,
          alt: pokemon.image?.alternativeText || pokemon.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },

    alternates: {
      canonical: `http://localhost:3000/products/${pokemon.slug}`,
    },

    // rich snippet data using other metadata
    other: {
      "product:price:amount": pokemon.price.toString(),
      "product:price:currency": "EUR",
      "product:availability": pokemon.stock > 0 ? "in stock" : "out of stock",
    },
  };
}

// generate static params for all Pokemon
export async function generateStaticParams() {
  try {
    const res = await fetch(
      "http://localhost:1337/api/pokemons?fields[0]=slug"
    );
    const data = await res.json();

    return data.data.map((pokemon: any) => ({
      slug: pokemon.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const pokemon = await getPokemon(params.slug);

  if (!pokemon) {
    notFound();
  }

  const imageUrl = pokemon.image?.url
    ? `http://localhost:1337${pokemon.image.url}`
    : "/placeholder-card.jpg";

  // JSON-LD structured data for Google rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pokemon.name,
    image: imageUrl,
    description: `${pokemon.name} Pokemon trading card in ${pokemon.condition?.title || "excellent"} condition`,
    brand: {
      "@type": "Brand",
      name: "Pokemon",
    },
    offers: {
      "@type": "Offer",
      url: `http://localhost:3000/products/${pokemon.slug}`,
      priceCurrency: "EUR",
      price: pokemon.price,
      availability:
        pokemon.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "24",
    },
  };

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* product Image */}
          <div>
            <img
              src={imageUrl}
              alt={pokemon.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{pokemon.name}</h1>

            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">
                ${pokemon.price}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              {pokemon.type && (
                <p>
                  <strong>Type:</strong> {pokemon.type.title}
                </p>
              )}
              {pokemon.rarity && (
                <p>
                  <strong>Rarity:</strong> {pokemon.rarity.title}
                </p>
              )}
              {pokemon.condition && (
                <p>
                  <strong>Condition:</strong> {pokemon.condition.title}
                </p>
              )}
              <p>
                <strong>Stock:</strong>
                {pokemon.stock > 0 ? (
                  <span className="text-green-600">
                    {" "}
                    {pokemon.stock} available
                  </span>
                ) : (
                  <span className="text-red-600"> Out of stock</span>
                )}
              </p>
            </div>

            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={pokemon.stock === 0}
            >
              {pokemon.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
