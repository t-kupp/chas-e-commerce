import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import QuantitySelector from "../../components/QuantitySelector";
import WishlistButton from "../../components/WishlistButton";

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
  const { slug } = await params;
  const pokemon = await getPokemon(slug);

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
  const { slug } = await params;
  const pokemon = await getPokemon(slug);

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

      <div className="h-[85vh] container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900">
            Products
          </Link>
          <span>/</span>
          <span className="text-yellow-600">{pokemon.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-2xl pt-2">
            <div className="flex justify-center px-20 overflow-hidden rounded-xl">
              <Image
                width={pokemon.image.formats.medium.width}
                height={pokemon.image.formats.medium.height}
                src={imageUrl}
                alt={pokemon.name}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {pokemon.name}
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              ${pokemon.price}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${pokemon.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span
                className={`text-sm font-medium ${pokemon.stock > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {pokemon.stock}{" "}
                {pokemon.stock > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            {pokemon.stock > 0 && <QuantitySelector maxStock={pokemon.stock} />}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Add to Cart Button */}
              <button
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  pokemon.stock > 0
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={pokemon.stock === 0}
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5 6m0 0h8"
                    />
                  </svg>
                  <span>
                    {pokemon.stock > 0 ? "Add to cart" : "Out of Stock"}
                  </span>
                </span>
              </button>

              {/* Wishlist Button */}
              <WishlistButton pokemon={pokemon} className="w-full" />
            </div>

            {/* Product Details Accordions */}
            <div className="pt-6">
              {/* Product Information */}
              <details className="group border-t border-gray-200">
                <summary className="flex items-center justify-between cursor-pointer py-3 text-lg font-medium text-gray-900">
                  Product information
                  <svg
                    className="w-5 h-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="pb-4 space-y-3 text-gray-600">
                  {pokemon.type && (
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <span>{pokemon.type.title}</span>
                    </div>
                  )}
                  {pokemon.rarity && (
                    <div className="flex justify-between">
                      <span className="font-medium">Rarity:</span>
                      <span>{pokemon.rarity.title}</span>
                    </div>
                  )}
                  {pokemon.condition && (
                    <div className="flex justify-between">
                      <span className="font-medium">Condition:</span>
                      <span>{pokemon.condition.title}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Stock:</span>
                    <span>{pokemon.stock} available</span>
                  </div>
                </div>
              </details>

              {/* Specifications */}
              <details className="group border-y border-gray-200">
                <summary className="flex items-center justify-between cursor-pointer py-3 text-lg font-medium text-gray-900">
                  Specifications
                  <svg
                    className="w-5 h-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="pb-4 space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Card Type:</span>
                    <span>Trading Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Game:</span>
                    <span>Pokémon TCG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Language:</span>
                    <span>English</span>
                  </div>
                </div>
              </details>

              {/* Delivery & Payment */}
              <details className="group border-b border-gray-200">
                <summary className="flex items-center justify-between cursor-pointer py-3 text-lg font-medium text-gray-900">
                  Delivery & payment
                  <svg
                    className="w-5 h-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="pb-4 space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Delivery time:</span>
                    <span>2-4 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Shipping cost:</span>
                    <span>Free shipping over $50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment methods:</span>
                    <span>Card, PayPal</span>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
