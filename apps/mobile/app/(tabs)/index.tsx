import React from "react";
import {Text, View} from "react-native";
import Footer from "../components/footer";
import Header from "../components/header";

export default function HomePage() {
  return (
    <View>
      <Header />
      <Text className="text-red-700">HomePage</Text>
      <Footer />
    </View>
  );
}
