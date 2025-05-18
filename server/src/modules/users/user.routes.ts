import { Role } from "@prisma/client";
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import userController from "./user.controller";
import { updateUserDto } from "./user.dto";

const { requireAuth, requireRole } = authMiddleware;
const { validate } = validationMiddleware;

const router = Router();

router.get("/", requireAuth, requireRole(Role.ADMIN), userController.getAllUsers);
router.put("/", requireAuth, validate(updateUserDto), userController.updateUser);
router.delete("/:id", requireAuth, requireAuth, userController.deleteUser);
router.get("/me", requireAuth, userController.getProfile);

export { router as userRoutes };

