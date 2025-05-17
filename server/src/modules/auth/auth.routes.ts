import { Router } from "express";
import validationMiddleware from "../../middleware/validation.middleware";
import authController from "./auth.controller";
import { createUserDto, loginDto } from "./auth.dto";

const router = Router();

router.post("/login", validationMiddleware.validate(loginDto), authController.login);
router.post("/register", validationMiddleware.validate(createUserDto), authController.createUser);

export { router as authRoutes };

