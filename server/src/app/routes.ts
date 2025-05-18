import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { parkingSlotRoutes } from "../modules/parking-slots/parking-slot.routes";
import { userRoutes } from "../modules/users/user.routes";
import { vehicleRoutes } from "../modules/vehicles/vehicle.routes";
import { parkingRoutes } from "../modules/parking/parking.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/parking", parkingRoutes);
router.use("/parking-slots", parkingSlotRoutes);

export { router as routes };
