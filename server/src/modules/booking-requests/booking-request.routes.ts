import { Role } from "@prisma/client";
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import bookingRequestController from "./booking-request.controller";
import { CreateSlotRequestDto, DecisionDto, UpdateSlotRequestDto } from "./booking-request.dto";

const router = Router();

const { requireAuth, requireRole } = authMiddleware;
const { validate } = validationMiddleware;

router.use(requireAuth);

router.post("/", requireRole(Role.USER), validate(CreateSlotRequestDto), bookingRequestController.create);
router.put("/:id", requireRole(Role.ADMIN), validate(UpdateSlotRequestDto), bookingRequestController.update);
router.delete("/:id", requireRole(Role.ADMIN), bookingRequestController.delete);
router.post("/:id/decide", requireRole(Role.ADMIN), validate(DecisionDto), bookingRequestController.decide);
router.get("/", requireRole(Role.ADMIN), bookingRequestController.list);

export { router as bookingRequestRoutes };

