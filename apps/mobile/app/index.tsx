import React from "react";
import { View, ScrollView } from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";
import ProductCard from "./components/productCard";

export default function HomePage() {
  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <Header />
        <Hero />
        <ProductCard />
      </ScrollView>
      <Footer />
    </View>
  );
}
