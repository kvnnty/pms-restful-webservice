import type { Parking } from "./parking";

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  vehicleType: string;
  status: string;
  parkingId: string;
  parking?: Parking;
}
