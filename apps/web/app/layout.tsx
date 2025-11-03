import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "./components/Footer";
import Header from "./components/Header";
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
  metadataBase: new URL("http://localhost:3000"),
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

  // open graph for social media sharing
  openGraph: {
    type: "website",
    locale: "sv-SE",
    url: "http://localhost:3000",
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

  // robots and indexing
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

  // additional metadata
  alternates: {
    canonical: "http://localhost:3000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col pt-18!`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-8EJ2LZQSRB" />
    </html>
  );
}
