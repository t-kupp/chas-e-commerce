import { MetadataRoute } from "next";

// fetch all Pokemon from Strapi
async function getAllPokemon() {
  try {
    const res = await fetch(
      "http://localhost:1337/api/pokemons?fields[0]=slug&fields[1]=updatedAt"
    );
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching pokemon for sitemap:", error);
    return [];
  }
}

// fetch all types
async function getAllTypes() {
  try {
    const res = await fetch(
      "http://localhost:1337/api/types?fields[0]=slug&fields[1]=updatedAt"
    );
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching types for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000";

  // fetch dynamic data
  const pokemon = await getAllPokemon();
  const types = await getAllTypes();

  // static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  // product pages
  const productPages = pokemon.map((p: any) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // type pages
  const typePages = types.map((t: any) => ({
    url: `${baseUrl}/types/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...typePages];
}
