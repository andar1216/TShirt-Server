import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Verify required Stripe environment variables
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
  console.error("Missing Stripe API keys in environment variables.");
  process.exit(1);
}

// Setup PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "", // Ensure you set PG_PASSWORD in your .env file
  database: process.env.PG_DATABASE || "postgres",
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
    process.exit(1);
  }
  console.log("Connected to PostgreSQL database");
  release();
});

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
import picturesRoute from "./routes/pictures.js";
import printfulRoutes from "./routes/printful.js";
import stripeRoutes from "./routes/stripe.js";
import userRoutes from "./routes/users/user.js";

// Mount the routes
app.use("/api/products", productsRoute);
app.use("/api/pictures", picturesRoute);
app.use("/api/printful", printfulRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/users", userRoutes);

// Registration endpoint to insert user data into PostgreSQL
// Registration endpoint to insert user data into PostgreSQL
app.post('/api/register', async (req, res) => {
  const { fullName, username, email, password } = req.body;

  // Validate that all required fields are provided
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the username already exists in the database
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    if (userCheck.rows.length > 0) {
      console.error('Username taken');
      return res.status(400).json({ error: 'Username taken' });
    }

    // Check if the email already exists in the database
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      console.error('Email taken');
      return res.status(400).json({ error: 'Email taken' });
    }

    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user data into the database using a parameterized query
    const result = await pool.query(
      'INSERT INTO users (full_name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [fullName, username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Route to send the publishable Stripe key to the client
app.get("/config", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Serve the React app's index.html for any unmatched routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the Express server on port 5252
const PORT = process.env.PORT || 5252;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
