import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./context/auth";
import { WishlistProvider } from "./context/wishlist";
import { generateOrganizationSchema, generateWebsiteSchema } from "./lib/seo";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Pokemon Cards Store - Rare & Collectible Trading Cards",
    template: "%s | Pokemon Cards Store", // %s does so pages will show "Page Name | Pokemon Cards Store"
  },
  description:
    "Buy authentic Pokemon trading cards. Browse rare, holographic, and collectible Pokemon cards with fast shipping.",
  keywords: [
    "pokemon cards",
    "trading cards",
    "pokemon tcg",
    "collectible cards",
    "rare pokemon",
    "holographic cards",
  ],
  authors: [{ name: "Pokemon Cards Store" }],
  creator: "Pokemon Cards Store",
  publisher: "Pokemon Cards Store",

  openGraph: {
    type: "website",
    locale: "sv-SE",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Pokemon Cards Store",
    title: "Pokemon Cards Store - Rare & Collectible Trading Cards",
    description:
      "Buy authentic Pokemon trading cards. Browse rare, holographic, and collectible Pokemon cards.",
    images: [
      {
        url: "/social-image.png",
        width: 1200,
        height: 630,
        alt: "Pokemon Cards Store",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="sv">
      <head>
        {/* schema.org organization markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* schema.org website markup with search functionality */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col pt-18!`}
      >
        <AuthProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-8EJ2LZQSRB" />
    </html>
  );
}
