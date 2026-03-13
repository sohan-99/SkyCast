import { Router } from "express";

import { currentWeather, forecastWeather } from "../controllers/weatherController";
import { optionalAuthMiddleware } from "../middleware/auth";

const router = Router();

router.get("/current/:city", optionalAuthMiddleware, currentWeather);
router.get("/forecast/:city", optionalAuthMiddleware, forecastWeather);

export default router;
