import React from "react";
import {Stack, Tabs} from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen name="index" options={{title: "Home"}} />
      <Tabs.Screen name="cart" options={{title: "Cart"}} />
    </Tabs>
  );
}
