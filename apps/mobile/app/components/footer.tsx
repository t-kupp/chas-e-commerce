import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function Footer() {
  return (
    <View className="bg-red-600 py-8 px-4">
      {/* Pokeball divider */}
      <View className="items-center mb-6">
        <View className="w-12 h-12 relative">
          <View className="absolute inset-0 bg-white rounded-full" />
          <View className="absolute top-0 left-0 right-0 h-6 bg-red-500 rounded-t-full" />
          <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-800" />
          <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-row justify-around mb-6 flex-wrap">
        <View className="items-center min-w-[100px] mb-4">
          <Text className="text-yellow-300 text-lg font-bold mb-3">
            Explore
          </Text>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Pokédex</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Items</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Abilities</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center min-w-[100px] mb-4">
          <Text className="text-yellow-300 text-lg font-bold mb-3">
            Community
          </Text>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Forums</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Trading</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Battles</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center min-w-[100px] mb-4">
          <Text className="text-yellow-300 text-lg font-bold mb-3">
            Support
          </Text>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-white text-sm my-1.5">Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom bar */}
      <View className="border-t border-red-800 pt-6 items-center">
        <Text className="text-yellow-100 text-sm mb-2">
          Gotta Catch Em All!
        </Text>
        <Text className="text-red-200 text-xs">
          © 2025 Pokémon. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
