import type { ParkingSession } from "./parking-session";
import type { User } from "./user";
import type { Vehicle } from "./vehicle";

export interface Bill {
  id: string;
  parkingSessionId: string;
  vehicleId: string;
  userId: string;
  amount: number;
  isPaid: boolean;
  createdAt: string;
  parkingSession: ParkingSession;
  vehicle: Vehicle;
  user: User;
}
