import React, { useState } from "react";
import PaymentComponent from "./paymentComponent";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import RenderAddressStep, { Address } from "./adressComponent";
import { useCart } from "../context/CartContext";

type Step = 1 | 2;

const checkOut = () => {
  const { total } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const renderStepIndicator = () => (
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

  const renderAddressStep = () => (
    <RenderAddressStep
      selectedAddress={selectedAddress}
      setSelectedAddress={setSelectedAddress}
      addresses={addresses}
      setAddresses={setAddresses}
    />
  );

  const renderPaymentStep = () => (
    <PaymentComponent
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      cartTotal={total}
    />
  );

  const renderBottomButtons = () => (
    <View className="flex-row px-6 py-4 bg-white border-t border-gray-200">
      {currentStep > 1 && (
        <TouchableOpacity
          onPress={() => setCurrentStep((currentStep - 1) as Step)}
          className="flex-1 py-4 border-2 border-black rounded-xl mr-2"
        >
          <Text className="text-center text-base font-semibold">Back</Text>
        </TouchableOpacity>
      )}

      {currentStep < 2 && (
        <TouchableOpacity
          onPress={() => {
            if (currentStep < 3 && addresses.length > 0) {
              setPaymentMethod("Credit Card");
              setCurrentStep((currentStep + 1) as Step);
            } else {
              // Handle payment
              console.log("Addresses are empty");
            }
          }}
          className="flex-1 py-4 bg-black rounded-xl ml-2"
        >
          <Text className="text-center text-white text-base font-semibold">
            Next
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <Text className="text-2xl font-bold">Checkout</Text>
      </View>

      {renderStepIndicator()}
      {/* <RenderStepIndicator currentStep={currentStep} /> */}

      <ScrollView className="flex-1">
        {currentStep === 1 && renderAddressStep()}
        {currentStep === 2 && renderPaymentStep()}
      </ScrollView>

      {renderBottomButtons()}
    </SafeAreaView>
  );
};

export default checkOut;
