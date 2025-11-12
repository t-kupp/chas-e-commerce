export default {
  routes: [
    {
      method: "POST",
      path: "/stripe/payment-intent",
      handler: "api::stripe.stripe.createPaymentIntent",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
