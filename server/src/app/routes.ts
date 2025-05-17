import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export { router as routes };
