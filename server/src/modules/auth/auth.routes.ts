import { Router } from "express";
import authController from "./auth.controller";

const router = Router();

router.post("/login", authController.login);

export { router as authRoutes };
