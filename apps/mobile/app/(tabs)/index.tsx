import React, {useRef, useState} from "react";
import {View, ScrollView} from "react-native";
import Footer from "../components/footer";
import Hero from "../components/hero";
import ProductCard from "../components/productCard";
import Filter, {SortOption} from "../components/filter";

export default function HomePage() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [productY, setProductY] = useState(0);
  const [selectedSort, setSelectedSort] = useState<SortOption>(null);

  const scrollToProducts = () => {
    scrollViewRef.current?.scrollTo({y: productY, animated: true});
  };

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
