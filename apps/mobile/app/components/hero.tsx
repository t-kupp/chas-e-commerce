import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";

export default function Hero() {
  return (
    <ImageBackground
      source={require("../assets/images/pokeimg.jpg")} // Add your image path here
      style={{ height: 700 }}
      className="w-full"
      resizeMode="cover"
    >
      {/* Dark overlay for text readability */}
      <View className="absolute inset-0 bg-black opacity-50" />

      {/* Content */}
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-white text-5xl font-bold text-center mb-4">
          Pokémon Cards
        </Text>
        <Text className="text-white text-lg text-center mb-8">
          Buy Rare Cards
        </Text>

        <TouchableOpacity className="bg-yellow-400 px-10 py-4 rounded-lg">
          <Text className="text-slate-900 font-bold text-lg">Shop Now</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
