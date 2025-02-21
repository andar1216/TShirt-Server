import express from "express";
import { shirtsList } from "../public/products/shirts/_shirts_directory.js";
import { sweatshirtsList } from "../public/products/sweatshirts/_sweatshirts_directory.js";
import { mugslist } from "../public/products/mugs/_mugs_directory.js";

const router = express.Router();

// GET /api/products/shirts
router.get("/shirts", (req, res) => {
  res.json(shirtsList);
});

// GET /api/products/sweatshirts
router.get("/sweatshirts", (req, res) => {
  res.json(sweatshirtsList);
});

// GET /api/products/sweatshirts
router.get("/mugs", (req, res) => {
  res.json(mugsList);
});

// GET /api/products
// Returns both shirts and sweatshirts combined
router.get("/", (req, res) => {
  const allProducts = [...shirtsList, ...sweatshirtsList, ...mugslist];
  res.json(allProducts);
});

export default router;
