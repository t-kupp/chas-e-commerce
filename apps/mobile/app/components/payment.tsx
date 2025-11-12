// PaymentTest.js
import React, { useEffect, useState } from "react";
import { Button, View, Text } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

export default function PaymentTest() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Fetch clientSecret from Strapi backend
  useEffect(() => {
    fetch("http://localhost:1337/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }), // amount in cents
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        initializePaymentSheet(data.clientSecret);
      })
      .catch(console.log);
  }, []);

  // 2️⃣ Initialize Payment Sheet
  const initializePaymentSheet = async (secret: string) => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: secret,
      merchantDisplayName: "Pokémon Store",
    });

    if (error) {
      console.log("Error initializing payment sheet:", error);
    }
  };

  // 3️⃣ Show Stripe Payment Sheet
  const handlePayment = async () => {
    if (!clientSecret) return;

    setLoading(true);
    const { error } = await presentPaymentSheet();

    if (error) {
      alert(`Payment failed: ${error.message}`);
    } else {
      alert("Payment successful!");
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Stripe Test Payment</Text>
      <Button
        title="Pay $10"
        onPress={handlePayment}
        disabled={loading || !clientSecret}
      />
    </View>
  );
}
