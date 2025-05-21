import { Role } from "@prisma/client";
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import vehicleController from "./vehicle.controller";
import { registerVehicleDto, updateVehicleDto } from "./vehicle.dto";

const router = Router();

const { requireAuth, requireRole } = authMiddleware;
const { validate } = validationMiddleware;

router.use(requireAuth);

router.post("/register", validate(registerVehicleDto), vehicleController.createVehicle);
router.get("/", requireRole(Role.ADMIN), vehicleController.getAllVehicles);
router.get("/user", vehicleController.getVehiclesByUser);
router.get("/:id", vehicleController.getVehicleById);
router.get("/plateNumber/:plateNumber", vehicleController.getVehicleByPlateNumber);
router.put("/:id", validate(updateVehicleDto), vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);

export { router as vehicleRoutes };
