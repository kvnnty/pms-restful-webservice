import { Router } from "express";
import parkingSessionController from "./parking-session.controller";
import authMiddleware from "../../middleware/auth.middleware";
const { requireAuth, requireRole } = authMiddleware;
const router = Router();

router.use(requireAuth);

router.post("/entry", requireRole("PARKING_ATTENDANT"), parkingSessionController.recordEntry);
router.get("/", requireRole("PARKING_ATTENDANT"), parkingSessionController.getParkingSessions);
router.post("/exit", requireRole("PARKING_ATTENDANT"), parkingSessionController.recordExit);

export { router as parkingSessionRouter };
