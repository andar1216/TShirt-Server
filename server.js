// server.js
require("dotenv").config(); // Load env variables

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Check that required Stripe environment variables exist
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
  console.error("Missing Stripe API keys in environment variables.");
  process.exit(1);
}

// Initialize Stripe with your secret key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

// Enable CORS for the frontend origins you need
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Parse JSON bodies (useful for POST requests)
app.use(express.json());

// Stripe route to create a PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    // For demonstration, using a fixed amount of $19.99 (1999 cents)
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: 1999, // $19.99 in cents
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send the client secret back to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(400).json({ error: { message: error.message } });
  }
});

// Optional route to send the publishable Stripe key to the client
app.get("/config", (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Import and mount the Printful routes at /api/printful
const printfulRoutes = require("./routes/printful");
app.use("/api/printful", printfulRoutes);

// Serve static files from the public folder (assumes your React build output is here)
app.use(express.static(path.join(__dirname, "public")));

// For any route not handled above, serve the React app's index.html from public
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


// Start the Express server on port 5252 (or the port specified in your env)
const PORT = process.env.PORT || 5252;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
