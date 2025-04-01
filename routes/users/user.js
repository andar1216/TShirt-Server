import express from "express";
const router = express.Router();

// POST route to add a new user
router.post("/", async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await req.app.locals.db.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
      [username, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
