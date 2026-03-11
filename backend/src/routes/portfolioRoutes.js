import { Router } from "express";
import { getPortfolio, updatePortfolio } from "../controllers/portfolioController.js";
import { validateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.use(validateToken);

router.get('/', getPortfolio);
router.put('/', updatePortfolio);

export default router;
