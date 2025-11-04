import React, {createContext, useContext, useMemo, useState} from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  total: number;
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

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{items, addItem, removeItem, clearCart, total}}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart(): CartContextType {
  return useContext(CartContext) as CartContextType;
}
// import {useContext, useState, createContext} from "react";

// type CartItem = {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
// };

// type CartContextType = {
//   items: CartItem[];
//   addItem: any;
//   removeItem: any;
//   clearCart: any;
//   total: number;
//   cartItems: CartItem[];;

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({children}: {children: React.ReactNode}) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [total, setTotal] = useState(0);

//   // Add item
//   function addItem(item: CartItem) {
//     setCartItems((prev) => {
//       const existingItem = prev.find((cartItem) => cartItem.id === item.id);
//       if (existingItem) {
//         return prev.map((cartItem) =>
//           cartItem.id === item.id
//             ? {...cartItem, quantity: cartItem.quantity + item.quantity}
//             : cartItem
//         );
//       } else {
//         return [...prev, item];
//       }
//     });
//   }

//   // Remove item
//   function removeItem(item: CartItem) {
//     setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
//   }

//   // Clear cart
//   function clearCart() {
//     return setCartItems([]);
//   }

//   // Total price
//   function getTotal() {
//     return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         setCartItems,
//         addItem,
//         removeItem,
//         clearCart,
//         getTotal,
//         total,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
