import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/auth";

export default function RootLayout() {
  const { items = [] } = useCart();
  const { user } = useAuth();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const badge = itemCount > 0 ? itemCount : undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fbbf24",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#1F2937" },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: badge,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: user ? "Account" : "Sign in",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={user ? "person-outline" : "log-in-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="productCardDetailPage/[slug]"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
