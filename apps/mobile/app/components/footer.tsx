import React from "react";
import {Text, View} from "react-native";

export default function Footer() {
  return (
    <View className="bg-gray-800 py-3 px-4 w-full">
      {/* Pokeball divider */}
      <View className="items-center mb-2">
        <View className="w-8 h-8 relative">
          <View className="absolute inset-0 bg-white rounded-full" />
          <View className="absolute top-0 left-0 right-0 h-4 bg-red-500 rounded-t-full" />
          <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-gray-800" />
          <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800" />
        </View>
      </View>

      {/* Bottom bar */}
      <View className="pt-2 items-center">
        <Text className="text-yellow-400 text-xs mb-1">
          Gotta Catch Em All!
        </Text>
        <Text className="text-yellow-400 text-xs">
          © 2025 Pokémon. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
