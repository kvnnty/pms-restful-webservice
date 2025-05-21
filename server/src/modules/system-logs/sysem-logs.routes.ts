import { Router } from "express";
import logsController from "./system-logs.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { Role } from "@prisma/client";
const router = Router();

const { requireAuth, requireRole } = authMiddleware;

router.get("/", requireAuth, requireRole(Role.ADMIN), logsController.getLogs);

export { router as systemLogsRoutes };
