import { Router } from "express";
import { getPortfolio, updatePortfolio } from "../controllers/portfolioController.js";
import { validateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Apply validateToken middleware to all routes below this line
// This ensures only logged-in users can access portfolio endpoints
router.use(validateToken);

// Route to get a user's portfolio
router.get('/', getPortfolio);

// Route to update a user's portfolio
router.put('/', updatePortfolio);

export default router;
