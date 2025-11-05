"use client";

import { createContext, useContext, useState } from "react";
import { Pokemon } from "../../../shared/types/pokemon";

interface CartContextType {
  cart: CartItem[];
  addToCart: (pokemon: Pokemon) => void;
  removeFromCart: (pokemonId: number) => void;
  updateQuantity: (pokemonId: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

export interface CartItem {
  pokemonId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(pokemon: Pokemon) {
    // Check if item in cart exists
    const existingItem = cart.find((item) => item.pokemonId === pokemon.id);

    // If yes, increase quantity by 1
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.pokemonId === pokemon.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // Add new item with cached data
      setCart([
        ...cart,
        {
          pokemonId: pokemon.id,
          name: pokemon.name,
          price: pokemon.price,
          imageUrl: pokemon.image.formats.thumbnail?.url || pokemon.image.url,
          quantity: 1,
        },
      ]);
    }
  }

  function removeFromCart(pokemonId: number) {
    setCart(cart.filter((item) => item.pokemonId !== pokemonId));
  }

  function updateQuantity(pokemonId: number, quantity: number) {
    const existingItem = cart.find((item) => item.pokemonId === pokemonId);
    if (!existingItem || quantity <= 0) return;

    setCart(cart.map((item) => (item.pokemonId === pokemonId ? { ...item, quantity } : item)));
  }

  function getTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getTotalPrice() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function clearCart() {
    setCart([]);
  }

  console.log("cart:", cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
