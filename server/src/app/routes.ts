import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { bookingRequestRoutes } from "../modules/booking-requests/booking-request.routes";
import { parkingSlotRoutes } from "../modules/parking-slots/parking-slot.routes";
import { parkingRoutes } from "../modules/parking/parking.routes";
import { userRoutes } from "../modules/users/user.routes";
import { vehicleRoutes } from "../modules/vehicles/vehicle.routes";
import { parkingSessionRouter } from "../modules/parking-sessions/parking-session.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/parking", parkingRoutes);
router.use("/parking/slots", parkingSlotRoutes);
router.use("/booking-requests", bookingRequestRoutes);
router.use("/parking-sessions", parkingSessionRouter);

export { router as routes };
