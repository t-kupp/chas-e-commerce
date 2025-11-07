import React from "react";
import {View, Text} from "react-native";

export default function RenderStepIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <View className="flex-row items-center flex-1">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            currentStep >= 1 ? "bg-black" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-sm">1</Text>
        </View>
        <View className="ml-3">
          <Text className="text-xs text-gray-500">Step 1</Text>
          <Text className="text-sm font-semibold">Address</Text>
        </View>
      </View>

      <View className="flex-row items-center flex-1">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            currentStep >= 2 ? "bg-black" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-sm">2</Text>
        </View>
        <View className="ml-3">
          <Text className="text-xs text-gray-500">Step 2</Text>
          <Text
            className={`text-sm font-semibold ${
              currentStep >= 2 ? "text-black" : "text-gray-400"
            }`}
          >
            Payment
          </Text>
        </View>
      </View>
    </View>
  );
}
