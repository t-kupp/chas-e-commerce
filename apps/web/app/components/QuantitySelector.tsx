"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  maxStock: number;
  onQuantityChange?: (quantity: number) => void;
}

export default function QuantitySelector({
  maxStock,
  onQuantityChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState("1"); // Separate state for input display

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
      onQuantityChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxStock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
      onQuantityChange?.(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Allow empty string

    // Only update quantity if it's a valid number within range
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxStock) {
      setQuantity(numValue);
      onQuantityChange?.(numValue);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let correctedValue = 1;

    if (value === "" || isNaN(parseInt(value))) {
      // Empty or invalid input defaults to 1
      correctedValue = 1;
    } else {
      const numValue = parseInt(value);
      if (numValue < 1) {
        correctedValue = 1;
      } else if (numValue > maxStock) {
        correctedValue = maxStock;
      } else {
        correctedValue = numValue;
      }
    }

    setQuantity(correctedValue);
    setInputValue(correctedValue.toString());
    onQuantityChange?.(correctedValue);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select(); // Select all text when clicking on input
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className={`px-3 py-2 transition-colors ${
            quantity <= 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:rounded-lg"
          }`}>
          -
        </button>
        <input
          type="number"
          value={inputValue} // Use inputValue instead of quantity
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          min={1}
          max={maxStock}
          className="w-16 text-center py-2 border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={handleIncrease}
          disabled={quantity >= maxStock}
          className={`px-3 py-2 transition-colors ${
            quantity >= maxStock
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:rounded-lg"
          }`}>
          +
        </button>
      </div>
    </div>
  );
}
