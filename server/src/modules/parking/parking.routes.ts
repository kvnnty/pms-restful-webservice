import { Role } from "@prisma/client";
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import parkingController from "./parking.controller";
import validationMiddleware from "../../middleware/validation.middleware";
import { createParkingDto } from "./parking.dto";

const router = Router();

router.post("/", authMiddleware.requireAuth, authMiddleware.requireRole(Role.ADMIN), validationMiddleware.validate(createParkingDto), parkingController.create);
router.get("/", authMiddleware.requireAuth, parkingController.findAll);
router.get("/:id", authMiddleware.requireAuth, parkingController.findOne);
router.put("/:id", authMiddleware.requireAuth, authMiddleware.requireRole(Role.ADMIN), parkingController.update);
router.delete("/:id", authMiddleware.requireAuth, authMiddleware.requireRole(Role.ADMIN), parkingController.delete);

export { router as parkingRoutes };
