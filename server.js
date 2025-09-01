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

// -----------------
// Database config
// -----------------
// let poolConfig;

// if (process.env.DATABASE_URL) {
//   // Production on AWS RDS
//   poolConfig = {
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
//   };
// } else {
//   // Local development
//   poolConfig = {
//     host:     process.env.PG_HOST     || "localhost",
//     port:     +process.env.PG_PORT    || 5432,
//     user:     process.env.PG_USER     || "postgres",
//     password: process.env.PG_PASSWORD || "",
//     database: process.env.PG_DATABASE || "postgres",
//   };
// }

// export const pool = new Pool(poolConfig);

// pool.connect((err, client, release) => {
//   if (err) {
//     console.error("Error acquiring client", err.stack);
//     process.exit(1);
//   }
//   console.log("Connected to PostgreSQL database");
//   release();
// });

// -----------------
// Middleware & CORS
// -----------------
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
  console.error("Missing Stripe API keys in environment variables.");
  process.exit(1);
}

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
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// -----------------
// Route handlers
// -----------------
import productsRoute     from "./routes/products.js";
import picturesRoute     from "./routes/pictures.js";
import printfulRoutes    from "./routes/printful.js";
import stripeRoutes      from "./routes/stripe.js";
import userRoutes        from "./routes/users/user.js";

app.use("/api/products",  productsRoute);
app.use("/api/pictures",  picturesRoute);
app.use("/api/printful",  printfulRoutes);
app.use("/api/stripe",    stripeRoutes);
app.use("/api/users",     userRoutes);

// -----------------
// Registration
// -----------------
app.post('/api/register', async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    if (userCheck.rows.length) {
      return res.status(400).json({ error: 'Username taken' });
    }
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (emailCheck.rows.length) {
      return res.status(400).json({ error: 'Email taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users
         (full_name, username, email, password)
       VALUES
         ($1, $2, $3, $4)
       RETURNING id`,
      [fullName, username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User created successfully',
      userId:  result.rows[0].id
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -----------------
// Stripe config endpoint
// -----------------
app.get("/config", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// -----------------
// SPA fallback
// -----------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -----------------
// Boot server
// -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
