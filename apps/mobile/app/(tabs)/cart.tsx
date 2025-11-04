import React from "react";
import {View, Text} from "react-native";

export default function CartPage() {
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="">Din varukorg är tom</Text>
      </View>
    </View>
  );
}
