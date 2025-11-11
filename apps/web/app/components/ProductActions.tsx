"use client";

import { useEffect, useState } from "react";
import { Pokemon } from "../../../shared/types/pokemon";
import { trackProductView } from "../lib/analytics";
import AddToCartButton from "./AddToCartButton";
import QuantitySelector from "./QuantitySelector";
import WishlistButton from "./WishlistButton";

interface ProductActionsProps {
  pokemon: Pokemon;
}

export default function ProductActions({ pokemon }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);

  // Track product view when component mounts
  useEffect(() => {
    trackProductView(pokemon);
  }, [pokemon]);

  return (
    <>
      {/* Quantity Selector */}
      {(pokemon.stock ?? 0) > 0 && (
        <QuantitySelector maxStock={pokemon.stock ?? 0} onQuantityChange={setQuantity} />
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart Button */}
        <AddToCartButton
          pokemon={pokemon}
          quantity={quantity}
          disabled={(pokemon.stock ?? 0) === 0}
        />

        {/* Wishlist Button */}
        <WishlistButton pokemon={pokemon} className="w-full" />
      </div>
    </>
  );
}
