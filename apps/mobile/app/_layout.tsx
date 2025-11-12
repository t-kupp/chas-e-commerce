import React from "react";
import { Stack } from "expo-router";
import "./global.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishListContext";
import { AuthProvider } from "./context/auth";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function RootLayout() {
  return (
    <StripeProvider publishableKey="pk_test_51SSGDePMmNllIwESE1XUBx7vdJtfFwFtrv04AJhF4vTmURLDbwuOB9BoeIZ6QcCXreKK5NVrni3v8kC1U3IVOgZS00Kh7m9oxX">
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
    </StripeProvider>
  );
}
