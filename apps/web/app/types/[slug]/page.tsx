import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TypePageProps {
  params: { slug: string };
}

async function getTypeWithPokemon(slug: string) {
  try {
    const res = await fetch(
      `http://localhost:1337/api/types?filters[slug][$eq]=${slug}&populate[pokemon][populate]=*`,
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
    openGraph: {
      title,
      description,
      url: `http://localhost:3000/types/${type.slug}`,
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
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{type.title} Pokemon Cards</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {type.pokemon?.map((p: any) => {
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
              <p className="text-2xl font-bold text-blue-600">${p.price}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
