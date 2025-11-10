"use client";

import { useState } from "react";
import QuantityInput from "./QuantityInput";

interface QuantitySelectorProps {
  maxStock: number;
  onQuantityChange?: (quantity: number) => void;
}

export default function QuantitySelector({
  maxStock,
  onQuantityChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  return (
    <QuantityInput
      quantity={quantity}
      maxStock={maxStock}
      onQuantityChange={handleQuantityChange}
      size="lg"
    />
  );
}
