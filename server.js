// server.js
import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import picturesRoute from "./routes/pictures.js";

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Verify required Stripe environment variables
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
  console.error("Missing Stripe API keys in environment variables.");
  process.exit(1);
}

// Enable CORS for specified origins
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

// Parse JSON bodies for POST requests
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Import other routes using ES module syntax
import productsRoute from "./routes/products.js";
import printfulRoutes from "./routes/printful.js";
import stripeRoutes from "./routes/stripe.js"; // NEW: Import Stripe routes

// Mount the routes
app.use("/api/products", productsRoute);
app.use("/api/pictures", picturesRoute);
app.use("/api/stripe", stripeRoutes); // Mount the Stripe routes at /api/stripe

// Route to send the publishable Stripe key to the client
app.get("/config", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Mount Printful routes at /api/printful
app.use("/api/printful", printfulRoutes);

// Serve the React app's index.html for any unmatched routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the Express server on the specified port
const PORT = process.env.PORT || 5252;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
