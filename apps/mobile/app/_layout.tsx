import React from "react";
import {Stack} from "expo-router";
import "./global.css";
import {CartProvider} from "./context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen
          name="productCardDetailPage/[slug]"
          options={{
            title: "Product",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </CartProvider>
  );
}
