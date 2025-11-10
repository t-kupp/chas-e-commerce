"use client";

import { useState } from "react";
import { Pokemon } from "../../../shared/types/pokemon";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

interface ProductActionsProps {
  pokemon: Pokemon;
}

export default function ProductActions({ pokemon }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      {/* Quantity Selector */}
      {(pokemon.stock ?? 0) > 0 && (
        <QuantitySelector
          maxStock={pokemon.stock ?? 0}
          onQuantityChange={setQuantity}
        />
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
