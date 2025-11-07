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
  const images: Record<string, any> = {
    "Credit Card": require("../assets/images/nordea_kort.png"),
    PayPal: require("../assets/images/PayPal.svg.png"),
  };

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

      {/* Om PayPal är valt */}
      {paymentMethod === "PayPal" ? (
        <View className="h-full justify-center items-center mb-6">
          <Image
            source={images["PayPal"]}
            className="w-full h-40 rounded-lg mb-3"
            resizeMode="contain"
          />
        </View>
      ) : (
        /*  Nordea-bild när Credit Card är valt */
        <>
          <Image
            source={images["Credit Card"]}
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
            />
          </View>
        </>
      )}
    </View>
  );
}
