import React, {createContext, useContext, useState} from "react";
import {CartContextType, CartItem} from "../../../shared/types/pokemon";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({children}: {children: React.ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      // If item exists, increase quantity
      if (existing) {
        return prev.map((prevItem) =>
          prevItem.id === item.id
            ? prevItem.quantity < prevItem.stock
              ? {
                  ...prevItem,
                  quantity: prevItem.quantity + item.quantity,
                }
              : prevItem
            : prevItem
        );
      }

      return [...prev, item];
    });
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  // Clear cart
  const clearCart = () => setItems([]);

  // Increaseitem
  const increaseItem = (id: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {...p, quantity: Math.min(p.stock, (p.quantity || 1) + 1)}
          : p
      )
    );
  };

  // Decrease item quantity
  const decreaseItem = (id: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? {...p, quantity: Math.max(1, (p.quantity || 1) - 1)} : p
      )
    );
  };

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    // Ensure quantity is only 1 or more
    const amount = Math.max(1, Math.floor(Number(quantity) || 0));

    setItems((prevItems) =>
      prevItems.map((p) => (p.id === id ? {...p, quantity: amount} : p))
    );
  };

  // Total price
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        total,
        increaseItem,
        decreaseItem,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart(): CartContextType {
  return useContext(CartContext) as CartContextType;
}
