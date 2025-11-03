import React, { useRef, useState } from "react";
import { View, ScrollView } from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";
import ProductCard from "./components/productCard";

export default function HomePage() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [productY, setProductY] = useState(0);

  const scrollToProducts = () => {
    scrollViewRef.current?.scrollTo({ y: productY, animated: true });
  };

  return (
    <View className="flex-1">
      <Header />
      <ScrollView ref={scrollViewRef} className="flex-1">
        <Hero onShopNowPress={scrollToProducts} />
        <View onLayout={(event) => setProductY(event.nativeEvent.layout.y)}>
          <ProductCard />
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
