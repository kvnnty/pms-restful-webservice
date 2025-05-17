import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { slotRoutes } from "../modules/slots/slot.routes";
import { vehicleRoutes } from "../modules/vehicles/vehicle.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/slots", slotRoutes);
router.use("/vehicles", vehicleRoutes);

export { router as routes };
