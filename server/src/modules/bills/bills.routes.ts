import { Router } from "express";
import billController from "./bills.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { Role } from "@prisma/client";

const { requireAuth, requireRole } = authMiddleware;
const router = Router();

router.use(requireAuth);

// router.post("/", requireRole(Role.PARKING_ATTENDANT), billController.create);
router.get("/", billController.getAll);
router.get("/user/:userId", requireRole(Role.USER), billController.getByUser);

export { router as billsRoutes };
