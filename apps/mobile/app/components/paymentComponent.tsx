import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useAuth } from "../context/auth";
import { useCart } from "../context/CartContext";

interface Props {
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
  cartTotal: number;
}

export default function PaymentComponent({ cartTotal }: Props) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  // Calculate total with tax (assuming 10% tax)
  const TAX_RATE = 0.1;
  const tax = cartTotal * TAX_RATE;
  const totalWithTax = cartTotal + tax;
  // Convert to cents for Stripe (Stripe uses smallest currency unit)
  const amountInCents = Math.round(totalWithTax * 100);

  // Initialize and present Stripe payment
  const handleStripePayment = async () => {
    // Check if user is logged in
    if (!user) {
      Alert.alert("Login Required", "Please log in to complete your purchase", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to Login",
          onPress: () => {},
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:1337/api/stripe/payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amountInCents }),
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
        // Payment successful - save amount, clear cart and show success screen
        setPaidAmount(totalWithTax);
        clearCart();
        setPaymentSuccess(true);
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

  // Show success screen if payment went through
  if (paymentSuccess) {
    return (
      <View className="flex-1 p-6 items-center justify-center">
        <View className="items-center">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <Text className="text-6xl">✓</Text>
          </View>
          <Text className="text-3xl font-bold mb-2 text-center">
            Payment Successful!
          </Text>
          <Text className="text-lg text-gray-600 mb-4 text-center">
            Thank you for your purchase
          </Text>
          <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
            <Text className="text-gray-600 mb-1">Amount Paid:</Text>
            <Text className="text-2xl font-bold text-green-600">
              ${paidAmount.toFixed(2)}
            </Text>
          </View>
          <Text className="text-sm text-gray-500 text-center mb-6">
            A confirmation email has been sent to your email address.
          </Text>
          <TouchableOpacity
            onPress={() => setPaymentSuccess(false)}
            className="bg-black py-4 px-8 rounded-lg"
          >
            <Text className="text-white text-base font-semibold">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 p-6">
      <Text className="text-xl font-bold mb-4">Payment</Text>

      {/* Order Summary */}
      <View className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <Text className="text-lg font-semibold mb-3">Order Summary</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Subtotal:</Text>
          <Text className="font-medium">${cartTotal.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">
            Tax ({(TAX_RATE * 100).toFixed(0)}%):
          </Text>
          <Text className="font-medium">${tax.toFixed(2)}</Text>
        </View>
        <View className="border-t border-gray-300 my-2" />
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold">Total:</Text>
          <Text className="text-lg font-bold">${totalWithTax.toFixed(2)}</Text>
        </View>
      </View>

      {/* Stripe Payment Button */}
      <View className="mb-6">
        {!user && (
          <View className="mb-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <Text className="text-yellow-800 text-sm text-center">
              ⚠️ Please log in to complete your purchase
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={handleStripePayment}
          disabled={loading || cartTotal === 0 || !user}
          className={`py-4 rounded-lg ${
            loading || cartTotal === 0 || !user ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white text-lg font-bold">
              {!user
                ? "Login Required to Pay"
                : `Pay $${totalWithTax.toFixed(2)} with Stripe`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
