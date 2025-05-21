import type { ParkingSlot } from "./parking-slot";
import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export type ParkingSession = {
  id: string;
  entryTime: string;
  exitTime: string;
  vehicleId: string;
  isExited: boolean;
  chargedAmount: number;
  slotId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  slot: ParkingSlot;
  vehicle: Vehicle;
};
