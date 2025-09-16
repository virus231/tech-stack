import { login, register } from "../controllers/auth";
import { Router } from "express";

const router: Router = Router();

// POST /auth/register
router.post("/register", register);

// POST /auth/login
router.post("/login", login);

export default router;
