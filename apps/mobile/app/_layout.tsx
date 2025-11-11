import React from "react";
import { Stack } from "expo-router";
import "./global.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishListContext";
import { AuthProvider } from "./context/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="productCardDetailPage/[slug]"
              options={{
                title: "Product",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="components/checkout"
              options={{
                title: "Checkout",
                headerBackTitle: "back",
              }}
            />
          </Stack>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
