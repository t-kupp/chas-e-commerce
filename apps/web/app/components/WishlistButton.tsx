"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "../context/wishlist";
import { Pokemon } from "../../../shared/types/pokemon";

interface WishlistButtonProps {
  pokemon: Pokemon;
  variant?: "icon" | "button";
  className?: string;
}

export default function WishlistButton({
  pokemon,
  variant = "button",
  className = "",
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(pokemon.id);

  function toggleWishlist() {
    if (inWishlist) {
      removeFromWishlist(pokemon.id);
    } else {
      addToWishlist(pokemon);
    }
  }

  if (variant === "icon") {
    return (
      <button
        onClick={toggleWishlist}
        className={`p-2 rounded-full hover:bg-gray-100 transition ${className}`}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={24}
          className={
            inWishlist
              ? "fill-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          }
        />
      </button>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition ${
        inWishlist
          ? "bg-red-50 border-red-500 text-red-600 hover:bg-red-100"
          : "bg-white border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600"
      } ${className}`}
    >
      <Heart
        size={20}
        className={inWishlist ? "fill-red-500 text-red-500" : ""}
      />
      <span className="font-medium">
        {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </span>
    </button>
  );
}
