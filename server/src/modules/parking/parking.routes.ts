import { Role } from "@prisma/client";
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import parkingController from "./parking.controller";
import { createParkingDto, updateParkingDto } from "./parking.dto";

const router = Router();

const { requireAuth, requireRole } = authMiddleware;
const { validate } = validationMiddleware;

router.use(requireAuth);

router.post("/", requireRole(Role.ADMIN), validate(createParkingDto), parkingController.create);
router.get("/", parkingController.findAll);
router.get("/:id", parkingController.findOne);
router.put("/:id", requireRole(Role.ADMIN), validate(updateParkingDto), parkingController.update);
router.delete("/:id", requireRole(Role.ADMIN), parkingController.delete);
router.get("/:id/parking-slots", parkingController.listSlots);

export { router as parkingRoutes };
