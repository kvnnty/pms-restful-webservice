import type { ParkingSlot } from "./parking-slot";
import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export interface BookingRequest {
  id: string;
  userId: string;
  vehicleId: string;
  slotId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
  slot: ParkingSlot;
  user: User;
}
