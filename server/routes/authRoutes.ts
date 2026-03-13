import { Router } from "express";

import { login, logout, me, register } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { loginSchema, registerSchema } from "../utils/schemas";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

export default router;
