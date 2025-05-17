import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import vehicleController from "./vehicle.controller";
import { registerVehicleDto } from "./vehicle.dto";

const router = Router();

router.use(authMiddleware.requireAuth);

router.post("/register", validationMiddleware.validate(registerVehicleDto), vehicleController.createVehicle);
router.get("/", authMiddleware.requireAdminRole, vehicleController.getAllVehicles);
router.get("/user", vehicleController.getVehiclesByUser);
router.get("/:id", vehicleController.getVehicleById);
router.put("/:id", vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);

export { router as vehicleRoutes };

