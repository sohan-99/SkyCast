import { Router } from "express";

import {
  addFavoriteCity,
  getFavoriteCities,
  getHistory,
  removeFavoriteCity
} from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { favoriteSchema } from "../utils/schemas";

const router = Router();

router.use(authMiddleware);
router.post("/favorites", validateBody(favoriteSchema), addFavoriteCity);
router.get("/favorites", getFavoriteCities);
router.delete("/favorites", validateBody(favoriteSchema), removeFavoriteCity);
router.get("/history", getHistory);

export default router;
