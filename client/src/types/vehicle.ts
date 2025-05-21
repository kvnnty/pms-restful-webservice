import type { BookingRequest } from "./parking-slot-booking-request";
import type { User } from "./user";

export interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleType: string;
  ownerId: string;
  owner: User;
  bookingRequests: BookingRequest[];
  createdAt: string;
}
