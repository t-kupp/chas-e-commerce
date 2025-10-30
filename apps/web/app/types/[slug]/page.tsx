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
      url: `https://chas-e-commerce-web.vercel.app/types/${type.slug}`,
    },
    alternates: {
      canonical: `https://chas-e-commerce-web.vercel.app/types/${type.slug}`,
    },
  };
}

export default async function TypePage({ params }: TypePageProps) {
  const type = await getTypeWithPokemon(params.slug);

  if (!type) {
    notFound();
  }
  return (
    <div>
      <h1>{type.title} Pokemon Cards</h1>
      <p>
        Browse all {type.title} type Pokemon cards. Find rare and collectible{" "}
        {type.title} Pokemon trading cards with competitive prices.
      </p>
      <Link href="/products">Back to All Products</Link>
    </div>
  );
}
