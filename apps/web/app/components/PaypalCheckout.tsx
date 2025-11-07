import { PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "../context/cart";

interface PaypalCheckoutProps {
  isFormValid: boolean;
}

export default function PaypalCheckout({ isFormValid }: PaypalCheckoutProps) {
  const { getTotalPrice } = useCart();

  function createOrder(data: any, actions: any) {
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

  function onApprove(data: any, actions: any) {
    return actions.order.capture().then((details: any) => {
      alert(`Transaction successfully completed by ${details.payer.name.given_name}`);
      console.log("Payment details:", details);
      // TODO: Add order to Strapi
    });
  }

  function onError(error: any) {
    console.error("Paypal error:", error);
    alert("An error occurred with your payment");
  }

  return (
    <div>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        disabled={!isFormValid}
        className="mt-6"
      />
    </div>
  );
}
