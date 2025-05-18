import { Role } from "@prisma/client";
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import parkingSlotController from "./parking-slot.controller";
import validationMiddleware from "../../middleware/validation.middleware";
import { createBulkSlotSchema, createSlotSchema, updateSlotSchema } from "./parking-slot.dto";

const router = Router();

router.post(
  "/bulk",
  authMiddleware.requireAuth,
  authMiddleware.requireRole(Role.ADMIN),
  validationMiddleware.validate(createBulkSlotSchema),
  parkingSlotController.bulkCreateSlots
);
router.post(
  "/",
  authMiddleware.requireAuth,
  authMiddleware.requireRole(Role.ADMIN),
  validationMiddleware.validate(createSlotSchema),
  parkingSlotController.createSlot
);
router.patch(
  "/:id",
  authMiddleware.requireAuth,
  authMiddleware.requireRole(Role.ADMIN),
  validationMiddleware.validate(updateSlotSchema),
  parkingSlotController.updateSlot
);
router.delete("/:id", authMiddleware.requireAuth, authMiddleware.requireRole(Role.ADMIN), parkingSlotController.deleteSlot);
router.get("/:parkingId", authMiddleware.requireAuth, parkingSlotController.listSlots);
router.get("/:id", authMiddleware.requireAuth, parkingSlotController.getSlotById);

export { router as parkingSlotRoutes };
