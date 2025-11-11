"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "../context/cart";
import { Pokemon } from "../../../shared/types/pokemon";

interface AddToCartButtonProps {
  pokemon: Pokemon;
  quantity?: number;
  disabled?: boolean;
  className?: string;
}

export default function AddToCartButton({
  pokemon,
  quantity = 1,
  disabled = false,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  function handleAddToCart() {
    addToCart(pokemon, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }
  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      aria-label={
        disabled
          ? `${pokemon.name} is out of stock`
          : isAdded
            ? `${pokemon.name} added to cart`
            : `Add ${pokemon.name} to cart`
      }
      aria-live="polite"
      aria-atomic="true"
      className={`${className} w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
        isAdded
          ? "bg-green-500 hover:bg-green-600"
          : disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600"
      }`}
    >
      <span className="flex items-center justify-center space-x-2">
        {isAdded ? (
          <>
            <Check className="w-5 h-5" aria-hidden="true" />
            <span>
              {quantity > 1 ? `${quantity} items added!` : "Added to Cart!"}
            </span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            <span>{disabled ? "Out of Stock" : "Add to cart"}</span>
          </>
        )}
      </span>
    </button>
  );
}
