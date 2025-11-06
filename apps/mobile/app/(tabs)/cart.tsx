import React, {useState} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {useCart} from "../context/CartContext";

export default function CartPage() {
  const {total, items, removeItem, increaseItem, decreaseItem} = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [bonusCard, setBonusCard] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = 8;
  const shipping = 6;
  const finalTotal = subtotal + tax + shipping;

  function fixedPrice(a: number, b: number) {
    let x = a * b;
    return x.toFixed(2);
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-2xl font-bold mb-6">Shopping Cart</Text>

        {items.length < 1 ? (
          <Text className="text-center text-gray-500 py-8">
            Your cart is empty
          </Text>
        ) : (
          <View>
            {/* Cart Items */}
            {items.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-lg p-4 mb-4 flex-row"
              >
                <Image
                  className="w-20 h-20 rounded-lg"
                  resizeMode="contain"
                  source={{uri: `http://localhost:1337${item.image}`}}
                />

                <View className="flex-1 ml-4">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 justify-between gap-2 ">
                      <Text className="font-semibold text-base">
                        {item.name}{" "}
                        <Text className="text-gray-500 text-xs">
                          #{item.id}
                        </Text>
                      </Text>

                      <Text className="text-xs"> {item.price} </Text>
                    </View>

                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Text className="text-gray-400 text-xl">×</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-between items-center mt-3">
                    <View className="flex-row items-center bg-gray-100 rounded">
                      <TouchableOpacity
                        onPress={() => decreaseItem(item.id)}
                        className="px-3 py-1"
                      >
                        <Text className="text-gray-600">−</Text>
                      </TouchableOpacity>
                      <Text className="px-3">{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => increaseItem(item.id)}
                        className="px-3 py-1"
                      >
                        <Text className="text-gray-600">+</Text>
                      </TouchableOpacity>
                    </View>

                    <Text className="font-bold text-lg">
                      ${fixedPrice(item.price, item.quantity)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View className="bg-white rounded-lg p-6 mt-4">
              <Text className="text-xl font-bold mb-4">Order Summary</Text>

              {/* Promo Code */}
              <Text className="text-gray-600 text-sm mb-2">
                Discount code / Promo code
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Code"
                value={promoCode}
                onChangeText={setPromoCode}
              />

              {/* Bonus Card */}
              <Text className="text-gray-600 text-sm mb-2">
                Your bonus card number
              </Text>
              <View className="flex-row mb-6">
                <TextInput
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Enter Card Number"
                  value={bonusCard}
                  onChangeText={setBonusCard}
                />
                <TouchableOpacity className="ml-2 border border-gray-300 rounded-lg px-6 py-3">
                  <Text className="font-semibold">Apply</Text>
                </TouchableOpacity>
              </View>

              {/* Price Breakdown */}
              <View className="border-t border-gray-200 pt-4">
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text className="font-semibold">${Math.floor(subtotal)}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-600">Estimated Tax</Text>
                  <Text className="font-semibold">${tax}</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                  <Text className="text-gray-600">
                    Estimated shipping & Handling
                  </Text>
                  <Text className="font-semibold">${shipping}</Text>
                </View>
                <View className="flex-row justify-between border-t border-gray-200 pt-4">
                  <Text className="font-bold text-lg">Total</Text>
                  <Text className="font-bold text-lg">
                    ${Math.floor(finalTotal)}
                  </Text>
                </View>
              </View>

              {/* Checkout Button */}
              <TouchableOpacity className="bg-black rounded-lg py-4 mt-6">
                <Text className="text-white text-center font-semibold text-base">
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
