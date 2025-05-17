import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import userController from "./user.controller";

const router = Router();

router.post("/register", userController.createUser);
router.get("/", authMiddleware.requireAuth, authMiddleware.requireAdminRole, userController.getAllUsers);
router.put("/", authMiddleware.requireAuth, userController.updateUser);
router.delete("/:id", authMiddleware.requireAuth, authMiddleware.requireAuth, userController.deleteUser);
router.get("/me", authMiddleware.requireAuth, userController.getProfile);

export { router as userRoutes };

