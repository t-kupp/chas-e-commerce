"use client";

import { useState, useEffect } from "react";

interface QuantityInputProps {
  quantity: number;
  maxStock?: number;
  minQuantity?: number;
  onQuantityChange: (quantity: number) => void;
  size?: "sm" | "lg";
}

export default function QuantityInput({
  quantity,
  maxStock = 999,
  minQuantity = 1,
  onQuantityChange,
  size = "sm",
}: QuantityInputProps) {
  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxStock) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= minQuantity && numValue <= maxStock) {
      onQuantityChange(numValue);
    }
  };

  const handleInputBlur = () => {
    let correctedValue = minQuantity;

    if (inputValue === "" || isNaN(parseInt(inputValue))) {
      correctedValue = minQuantity;
    } else {
      const numValue = parseInt(inputValue);
      if (numValue < minQuantity) {
        correctedValue = minQuantity;
      } else if (numValue > maxStock) {
        correctedValue = maxStock;
      } else {
        correctedValue = numValue;
      }
    }

    setInputValue(correctedValue.toString());
    if (correctedValue !== quantity) {
      onQuantityChange(correctedValue);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // Size-based styling
  const sizeClasses = {
    sm: {
      button: "w-8 h-8 text-base",
      input: "w-12 text-sm",
      container: "border border-gray-300 rounded-lg",
    },
    lg: {
      button: "w-10 h-10 text-lg",
      input: "w-16 text-lg",
      container: "border border-gray-300 rounded-lg",
    },
  };

  const styles = sizeClasses[size];

  return (
    <div className="flex items-center">
      <div className={`flex items-center ${styles.container} overflow-hidden`}>
        <button
          onClick={handleDecrease}
          disabled={quantity <= minQuantity}
          className={`${styles.button} flex items-center justify-center transition-colors border-r border-gray-300 ${
            quantity <= minQuantity
              ? "text-gray-300 cursor-not-allowed bg-gray-50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          value={inputValue}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          min={minQuantity}
          max={maxStock}
          className={`${styles.input} text-center py-2 border-none focus:outline-none focus:ring-0 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          aria-label="Quantity"
        />
        <button
          onClick={handleIncrease}
          disabled={quantity >= maxStock}
          className={`${styles.button} flex items-center justify-center transition-colors border-l border-gray-300 ${
            quantity >= maxStock
              ? "text-gray-300 cursor-not-allowed bg-gray-50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}
