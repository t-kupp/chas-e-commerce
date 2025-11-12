import React, { useRef, useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import Footer from "../components/footer";
import Hero from "../components/hero";
import ProductCard from "../components/productCard";
import { SortOption } from "../../../shared/types/pokemon";
import Filter from "../components/filter";
import { useLocalSearchParams } from "expo-router";

export default function HomePage() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [productY, setProductY] = useState(0);
  const [selectedSort, setSelectedSort] = useState<SortOption>(null);
  const params = useLocalSearchParams();

  const scrollToProducts = () => {
    scrollViewRef.current?.scrollTo({ y: productY, animated: true });
  };

  useEffect(() => {
    if (params.scrollToProducts === "true" && productY > 0) {
      setTimeout(() => {
        scrollToProducts();
      }, 100);
    }
  }, [params.scrollToProducts, productY]);

  return (
    <View className="flex-1">
      <ScrollView ref={scrollViewRef} className="flex-1">
        <Hero onShopNowPress={scrollToProducts} />
        <Filter selectedSort={selectedSort} onSortChange={setSelectedSort} />
        <View onLayout={(event) => setProductY(event.nativeEvent.layout.y)}>
          <ProductCard sortBy={selectedSort} />
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
