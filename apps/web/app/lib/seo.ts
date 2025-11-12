import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = "Pokemon Cards Store";

interface ProductSEOProps {
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  rarity?: string;
  type?: string;
  condition?: string;
  description?: string;
}

interface ProductSchemaProps extends ProductSEOProps {
  brand?: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * SEO metadata for product pages
 */
export function generateProductMetadata({
  name,
  slug,
  price,
  stock,
  imageUrl,
  imageWidth = 800,
  imageHeight = 800,
  imageAlt,
  rarity,
  type,
  condition,
  description,
}: ProductSEOProps): Metadata {
  const title = `${name} - ${rarity || "Pokemon Card"}`;
  const desc =
    description ||
    `Buy ${name} Pokemon card. ${condition || "Excellent"} condition, ${rarity || "Rare"}. Only €${price}. ${stock > 0 ? `${stock} in stock` : "Out of stock"}.`;

  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${SITE_URL}${imageUrl}`;

  return {
    title,
    description: desc,
    keywords: [
      name,
      "pokemon card",
      type || "",
      rarity || "",
      "trading card",
      "collectible",
      "TCG",
      "Pokemon TCG",
    ].filter(Boolean),

    openGraph: {
      title,
      description: desc,
      type: "website",
      url: `${SITE_URL}/products/${slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt || name,
        },
      ],
      locale: "sv_SE",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [fullImageUrl],
    },

    alternates: {
      canonical: `${SITE_URL}/products/${slug}`,
    },

    // product-specific meta tags
    other: {
      "product:price:amount": price.toString(),
      "product:price:currency": "USD",
      "product:availability": stock > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
      "og:price:amount": price.toString(),
      "og:price:currency": "USD",
    },
  };
}

/**
 * schema.org product structured data
 */
export function generateProductSchema({
  name,
  slug,
  price,
  stock,
  imageUrl,
  condition,
  brand = "Pokemon",
  rating = 4.8,
  reviewCount = 24,
}: ProductSchemaProps) {
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${SITE_URL}${imageUrl}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: fullImageUrl,
    description: `${name} Pokemon trading card in ${condition || "excellent"} condition`,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${slug}`,
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability:
        stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * schema.org breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * schema.org organization structured data
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.facebook.com/",
      "https://twitter.com/",
      "https://www.instagram.com/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["Swedish", "English"],
    },
  };
}

/**
 * schema.org webSite structured data
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * collection page metadata
 */
export function generateCollectionMetadata({
  title,
  description,
  slug,
  itemCount,
}: {
  title: string;
  description: string;
  slug: string;
  itemCount?: number;
}): Metadata {
  const fullTitle = itemCount ? `${title} (${itemCount} products)` : title;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}/${slug}`,
      type: "website",
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: `${SITE_URL}/${slug}`,
    },
  };
}
