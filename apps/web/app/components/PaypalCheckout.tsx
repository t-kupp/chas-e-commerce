import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressFormData } from "../checkout/page";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { trackAddPaymentInfo, trackPurchase } from "../lib/analytics";

interface PaypalCheckoutProps {
  isFormValid: boolean;
  addressData: AddressFormData;
}

export default function PaypalCheckout({ isFormValid, addressData }: PaypalCheckoutProps) {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createOrder(data: any, actions: any) {
    // Track that user is adding payment info
    trackAddPaymentInfo("PayPal", cart, getTotalPrice());

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: getTotalPrice().toFixed(2),
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onApprove(data: any, actions: any) {
    try {
      setIsProcessing(true);

      // Capture PayPal payment
      const details = await actions.order.capture();
      console.log("Payment details:", details);

      // Check if user is logged in
      if (!user) {
        alert("You must be logged in to place an order");
        return;
      }

      // Get JWT token from localStorage
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      // Debug: Log cart items
      console.log("Cart items before mapping:", cart);

      // Format order items for Strapi - Components with relations need special format
      const orderItems = cart.map((item) => {
        console.log(
          `Mapping cart item: ${item.name}, pokemonId: ${item.pokemonId}, documentId: ${item.documentId}`
        );
        return {
          pokemon: item.documentId,
          Quantity: item.quantity,
        };
      });

      console.log("Order items to send:", orderItems);

      // Create order data
      const orderData = {
        data: {
          orderItems,
          total: getTotalPrice(),
          orderStatus: "pending",
          users_permissions_user: user.id,
          userAddress: addressData,
        },
      };

      console.log("Complete order data to send:", JSON.stringify(orderData, null, 2));

      // Send order to Strapi
      const response = await fetch("http://localhost:1337/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to create order");
      }

      const createdOrder = await response.json();
      console.log("Order created successfully:", createdOrder);

      // Track purchase completion with order ID
      const orderId = createdOrder.data.id || createdOrder.data.documentId || details.id;
      const tax = getTotalPrice() * 0.2; // 20% tax as shown in your UI

      trackPurchase(
        orderId.toString(),
        cart,
        getTotalPrice(),
        tax,
        0 // Free shipping
      );

      // Clear cart after successful order
      clearCart();

      // Redirect to orders list page
      router.push("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert(
        `Payment was successful, but there was an error creating your order. Please contact support.\nError: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onError(error: any) {
    console.error("Paypal error:", error);
    alert("An error occurred with your payment");
  }

  return (
    <div>
      {isProcessing && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-center">
          <p className="font-medium">Processing your order...</p>
          <p className="text-sm mt-1">Please wait while we create your order.</p>
        </div>
      )}
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        disabled={!isFormValid || isProcessing}
        className="mt-6"
      />
    </div>
  );
}
