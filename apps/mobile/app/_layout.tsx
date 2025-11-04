import React from "react";
import {Stack} from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack>
      {/* Tabs som huvudlayout utan header */}
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />

      <Stack.Screen
        name="productCardDetailPage/[slug]"
        options={{
          title: "Product",
          headerBackTitle: "", // FUKAR INTE
        }}
      />
    </Stack>
  );
}
