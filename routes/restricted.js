import express from "express";

const router = express.Router();

/**
 * Protected route - requires authentication.
 * 
 * NOTE: getServerSession from next-auth is for Next.js only.
 * For Express, you need to either:
 * 1. Verify the next-auth session token (authjs.session-token cookie) manually
 * 2. Use JWT verification if using NextAuth with JWT strategy
 * 3. Use your own auth (express-session, Passport, etc.) and check req.session
 * 
 * Example with a simple session check (once you add express-session):
 *   const session = await getSessionFromRequest(req);
 *   if (session) { ... } else { ... }
 */
router.get("/", async (req, res) => {
  // TODO: Replace with your actual session verification
  // For NextAuth: decode authjs.session-token cookie with NEXTAUTH_SECRET
  // For custom auth: check req.session.userId or verify JWT
  // Check for Bearer token or session cookie (add cookie-parser for req.cookies)
  const hasSession = req.headers.authorization?.startsWith("Bearer ");

  if (hasSession) {
    res.json({
      content:
        "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    res.status(401).json({
      error: "You must be signed in to view the protected content on this page.",
    });
  }
});

export default router;
