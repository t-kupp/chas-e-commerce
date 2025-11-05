import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import PageHeader from "../../components/PageHeader";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface TypePageProps {
  params: { slug: string };
}

async function getTypeWithPokemon(slug: string) {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/types?filters[slug][$eq]=${slug}&populate[pokemon][populate]=*`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching type:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: TypePageProps): Promise<Metadata> {
  const type = await getTypeWithPokemon(params.slug);

  if (!type) {
    return {
      title: "Type Not Found",
    };
  }

  const title = `${type.title} Pokemon Cards`;
  const description = `Browse all ${type.title} type Pokemon cards. Find rare and collectible ${type.title} Pokemon trading cards with competitive prices.`;

  return {
    title,
    description,
    keywords: [
      `${type.title} pokemon`,
      `${type.title} cards`,
      "pokemon tcg",
      "trading cards",
      "collectible cards",
    ],
    openGraph: {
      title,
      description,
      url: `http://localhost:3000/types/${type.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `http://localhost:3000/types/${type.slug}`,
    },
  };
}

export default async function TypePage({ params }: TypePageProps) {
  const type = await getTypeWithPokemon(params.slug);

  if (!type) {
    notFound();
  }

  const pokemonCount = type.pokemon?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHeader
        title={`${type.title} Type Cards`}
        description={`Explore our collection of ${pokemonCount} ${type.title.toLowerCase()} type Pokemon cards`}
        backLink={{
          href: "/types",
          label: "Back to All Types",
        }}
      />

      <main className="container mx-auto px-4 py-8 md:py-12">

        {/* breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/types" className="hover:text-gray-900">
            Types
          </Link>
          <span>/</span>
          <span className="text-yellow-600">{type.title}</span>
        </nav>

        {pokemonCount === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Cards Available
            </h2>
            <p className="text-gray-600 mb-6">
              We don&apos;t have any {type.title.toLowerCase()} type cards in
              stock right now.
            </p>
            <Link
              href="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-lg shadow-md transition-colors"
            >
              Browse All Cards
            </Link>
          </div>
        ) : (
          <>
            {/* product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {type.pokemon?.map((pokemon: any) => (
                <ProductCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          </>
        )}

        {/* call to action */}
        <div className="mt-16 bg-gray-800 rounded-xl p-8 md:p-12 text-center border-t-4 border-yellow-400">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto">
            Explore our complete collection or contact our team to request
            specific cards.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-lg shadow-md transition-colors"
            >
              Browse All Cards
            </Link>
            <Link
              href="/contact"
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
