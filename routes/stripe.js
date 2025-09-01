import express from "express";
import Stripe from "stripe";

const router = express.Router();

// Initialize Stripe using your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

// POST /api/stripe/create-payment-intent
router.post("/create-payment-intent", async (req, res, next) => {
  try {
    // Grab amount + currency from frontend
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "Amount and currency are required" });
    }

    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Error creating PaymentIntent:", error);
    next(error); // Pass to global error handler for consistent JSON
  }
});

export default router;
