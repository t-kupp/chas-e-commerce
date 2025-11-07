import React from "react";
import {View, Text, TextInput, TouchableOpacity, Image} from "react-native";

interface Props {
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
}

export default function PaymentComponent({
  paymentMethod,
  setPaymentMethod,
}: Props) {
  return (
    <View className="flex-1 p-6">
      <Text className="text-xl font-bold mb-4">Payment</Text>

      <View className="flex-row mb-6">
        {["Credit Card", "PayPal"].map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => setPaymentMethod(method)}
            className="mr-4"
          >
            <Text
              className={`text-base pb-2 ${
                paymentMethod === method
                  ? "font-bold border-b-2 border-black"
                  : "text-gray-400"
              }`}
            >
              {method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Credit Card Visual */}

      <Image
        source={require("../assets/images/nordea_kort.png")}
        className="w-full h-56 rounded-lg mb-6"
        resizeMode="cover"
      />

      {/* Form Fields */}
      <TextInput
        placeholder="Cardholder Name"
        className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-4 text-base"
        placeholderTextColor="#9CA3AF"
      />

      <TextInput
        placeholder="Card Number"
        className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-4 text-base"
        placeholderTextColor="#9CA3AF"
        keyboardType="number-pad"
      />

      <View className="flex-row mb-4">
        <TextInput
          placeholder="Exp.Date"
          className="bg-white border border-gray-300 rounded-xl px-4 py-4 flex-1 mr-2 text-base"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          placeholder="CVV"
          className="bg-white border border-gray-300 rounded-xl px-4 py-4 flex-1 ml-2 text-base"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
        />
      </View>
    </View>
  );
}
