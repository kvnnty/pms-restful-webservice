import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import userController from "./user.controller";
import { updateUserDto } from "./user.dto";

const router = Router();

router.get("/", authMiddleware.requireAuth, authMiddleware.requireAdminRole, userController.getAllUsers);
router.put("/", authMiddleware.requireAuth, validationMiddleware.validate(updateUserDto), userController.updateUser);
router.delete("/:id", authMiddleware.requireAuth, authMiddleware.requireAuth, userController.deleteUser);
router.get("/me", authMiddleware.requireAuth, userController.getProfile);

export { router as userRoutes };

