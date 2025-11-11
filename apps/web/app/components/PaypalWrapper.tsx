// This component is needed instead of wrapping the provider in layout.tsx because it needs "use client"

"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PaypalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
