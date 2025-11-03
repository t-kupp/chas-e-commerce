import React from "react";
import { View } from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";

export default function HomePage() {
  return (
    <View className="flex-1">
      <View className="flex-1">
        <Header />
        <Hero />
      </View>
      <Footer />
    </View>
  );
}
