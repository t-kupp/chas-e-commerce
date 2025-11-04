import React from "react";
import {View, Text} from "react-native";
import {useCart} from "../context/CartContext";

export default function CartPage() {
  const {total} = useCart();
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="">Din varukorg är tom</Text>
        <Text>{total}</Text>
      </View>
    </View>
  );
}
