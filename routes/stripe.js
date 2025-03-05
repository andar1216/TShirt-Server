import express from "express";
import Stripe from "stripe";

const router = express.Router();

// Initialize Stripe using your secret key from environment variables.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

// POST /api/stripe/create-payment-intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: 1999, // $19.99 in cents
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(400).json({ error: { message: error.message } });
  }
});

export default router;
