import React from "react";
import {View, Text, TouchableOpacity, ImageBackground} from "react-native";

interface HeroProps {
  onShopNowPress: () => void;
}

export default function Hero({onShopNowPress}: HeroProps) {
  return (
    <ImageBackground
      source={require("../assets/images/hero_image.jpg")} // Add your image path here
      style={{height: 800}}
      className="w-full"
      resizeMode="cover"
    >
      {/* Dark overlay for text readability */}
      <View className="absolute inset-0 bg-black opacity-40" />

      {/* Content */}
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-white text-5xl font-bold text-center mb-4">
          Pokémon
        </Text>
        <Text className="text-yellow-400 text-4xl font-extrabold mb-8">
          STORE
        </Text>
        <TouchableOpacity
          className="bg-yellow-400 px-10 py-4 rounded-lg"
          onPress={onShopNowPress}
        >
          <Text className="text-slate-900 font-bold text-lg">Shop Cards</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
