"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Pokemon } from "../../../shared/types/pokemon";
import { useWishlist } from "../context/wishlist";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

interface ProductCardProps {
  pokemon: Pokemon;
  onAddToCart?: (pokemon: Pokemon) => void;
}

export default function ProductCard({
  pokemon,
  onAddToCart,
}: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(pokemon.id);
  const [isAdded, setIsAdded] = useState(false);

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(pokemon.id);
    } else {
      addToWishlist(pokemon);
    }
  }

  function handleAddToCart() {
    if (onAddToCart) {
      onAddToCart(pokemon);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      console.log("Added to cart:", pokemon.name);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col relative">
      {/* wishlist heart button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition z-10"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={20}
          className={
            inWishlist
              ? "fill-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }
        />
      </button>
      {/* image */}
      <Link
        href={`/products/${pokemon.slug}`}
        className="block relative aspect-square bg-gray-50"
      >
        <Image
          src={`${STRAPI_URL}${pokemon.image.url}`}
          alt={pokemon.name}
          fill
          className="object-contain p-4"
        />
      </Link>
      {/* content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${pokemon.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-yellow-600 transition">
            {pokemon.name}
          </h3>
        </Link>

        {/* type and info */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs min-h-12">
          {pokemon.type && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded h-fit">
              {pokemon.type.title}
            </span>
          )}
          {pokemon.rarity && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded h-fit">
              {pokemon.rarity.title}
            </span>
          )}
          {pokemon.condition && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded h-fit">
              {pokemon.condition.title}
            </span>
          )}
        </div>

        {/* description */}
        {pokemon.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {pokemon.description}
          </p>
        )}

        {/* price */}
        <p className="text-2xl font-bold text-gray-900 mb-4">
          ${pokemon.price.toFixed(2)}
        </p>

        {/* stock info */}
        <p
          className={`text-sm mb-4 ${
            (pokemon.stock ?? 0) > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {(pokemon.stock ?? 0) > 0
            ? `${pokemon.stock} in stock`
            : "Out of stock"}
        </p>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={(pokemon.stock ?? 0) === 0}
            className={`flex-1 flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-lg transition ${
              isAdded
                ? "bg-green-500 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 text-white"
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <Check size={18} />
                <span className="hidden sm:inline">Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
