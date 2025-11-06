import React from "react";
import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useCart} from "../context/CartContext";

export default function RootLayout() {
  const {items = []} = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const badge = itemCount > 0 ? itemCount : undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "bg-gray-800",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: badge,
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: "Sign in",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
