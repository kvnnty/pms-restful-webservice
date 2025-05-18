import { Role } from "@prisma/client";
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import parkingSlotController from "./parking-slot.controller";
import { createBulkSlotSchema, createSlotSchema, updateSlotSchema } from "./parking-slot.dto";

const router = Router();

const { requireAuth, requireRole } = authMiddleware;
const { validate } = validationMiddleware;

router.use(requireAuth);

router.post("/bulk", requireRole(Role.ADMIN), validate(createBulkSlotSchema), parkingSlotController.bulkCreateSlots);
router.post("/", requireRole(Role.ADMIN), validate(createSlotSchema), parkingSlotController.createSlot);
router.patch("/:id", requireRole(Role.ADMIN), validate(updateSlotSchema), parkingSlotController.updateSlot);
router.delete("/:id", requireRole(Role.ADMIN), parkingSlotController.deleteSlot);
router.get("/:id", parkingSlotController.getSlotById);

export { router as parkingSlotRoutes };

