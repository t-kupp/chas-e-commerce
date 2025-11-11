import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default {
  async createPaymentIntent(ctx: any) {
    try {
      const { amount } = ctx.request.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      ctx.body = { clientSecret: paymentIntent.client_secret };
    } catch (error: any) {
      ctx.badRequest("Payment intent creation failed", {
        error: error.message,
      });
    }
  },
};
