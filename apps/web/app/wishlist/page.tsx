"use client";

import { useWishlist } from "../context/wishlist";
import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";

import { Pokemon } from "../../../shared/types/pokemon";

export default function WishlistPage() {
  const { wishlistItems, wishlistCount, clearWishlist } = useWishlist();

  function handleAddToCart(pokemon: Pokemon) {
    console.log("Added to cart:", pokemon.name);
  }

  if (wishlistCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Heart
              size={80}
              className="mx-auto text-gray-300"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-8">
            Start adding your favorite Pokemon cards to your wishlist!
          </p>
          <Link
            href="/products"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistCount} {wishlistCount === 1 ? "item" : "items"} saved
            </p>
          </div>
          {wishlistCount > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200 hover:border-red-300"
            >
              Clear All
            </button>
          )}
        </div>

        {/* wishlist grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((pokemon) => (
            <ProductCard
              key={pokemon.id}
              pokemon={pokemon}
              variant="wishlist"
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* continue shopping */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
