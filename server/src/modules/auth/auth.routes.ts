import { Router } from "express";
import validationMiddleware from "../../middleware/validation.middleware";
import authController from "./auth.controller";
import { createUserDto, loginDto } from "./auth.dto";

const { validate } = validationMiddleware;

const router = Router();

router.post("/login", validate(loginDto), authController.login);
router.post("/register", validate(createUserDto), authController.createUser);

export { router as authRoutes };
