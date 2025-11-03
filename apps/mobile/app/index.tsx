import React from "react";
import {View} from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";
import ProductCard from "./components/productCard";

export default function HomePage() {
  return (
    <View>
      <Header />
      <ProductCard />
      <Footer />
    </View>
  );
}
