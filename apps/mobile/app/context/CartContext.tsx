import React, {createContext, useContext, useMemo, useState} from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartContextType = {
  total: number;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  increaseItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({children}: {children: React.ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? {...p, quantity: p.quantity + item.quantity} : p
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setItems([]);

  const increaseItem = (id: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? {...p, quantity: (p.quantity || 1) + 1} : p
      )
    );
  };

  const decreaseItem = (id: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? {...p, quantity: Math.max(1, (p.quantity || 1) - 1)} : p
      )
    );
  };

  const updateQuantity = (id: number, qty: number) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? {...p, quantity: Math.max(1, qty)} : p))
    );
  };

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

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
