import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

interface Props {
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
}

export default function PaymentComponent({
  paymentMethod,
  setPaymentMethod,
}: Props) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const images: Record<string, any> = {
    "Credit Card": require("../assets/images/nordea_kort.png"),
    PayPal: require("../assets/images/PayPal.svg.png"),
  };

  // Initialize and present Stripe payment
  const handleStripePayment = async () => {
    setLoading(true);
    try {
      // 1. Fetch payment intent from backend
      const response = await fetch(
        "http://localhost:1337/api/stripe/payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1000 }), // $10.00 test payment
        }
      );

      if (!response.ok) {
        Alert.alert(
          "Error",
          "Could not connect to backend. Make sure it's running on localhost:1337"
        );
        setLoading(false);
        return;
      }

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        Alert.alert("Backend Error", backendError);
        setLoading(false);
        return;
      }

      if (!clientSecret) {
        Alert.alert("Error", "No payment intent received from backend");
        setLoading(false);
        return;
      }

      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Pokémon Store",
      });

      if (initError) {
        Alert.alert("Stripe Init Error", initError.message);
        setLoading(false);
        return;
      }

      // 3. Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert("Payment Cancelled", presentError.message);
      } else {
        Alert.alert("Success", "Payment successful! 🎉");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Error", `Failed to process payment: ${errorMessage}`);
      console.log("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6">
      <Text className="text-xl font-bold mb-4">Payment</Text>

      {/* Stripe Test Payment Button */}
      <View className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
        <Text className="text-sm font-semibold mb-2 text-blue-900">
          🧪 Test Stripe Payment
        </Text>
        <Text className="text-xs text-blue-700 mb-3">
          Click below to test a $10 payment with Stripe
        </Text>
        <TouchableOpacity
          onPress={handleStripePayment}
          disabled={loading}
          className={`py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600"}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-semibold">
              Pay $10 with Stripe
            </Text>
          )}
        </TouchableOpacity>
      </View>

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
