import { VehicleType } from "@prisma/client";
import { z } from "zod";

export const updateSlotSchema = z.object({
  vehicleType: z.nativeEnum(VehicleType).optional(),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
});

export const createBulkSlotSchema = z.object({
  parkingId: z.string({ required_error: "Parking ID is required" }).min(1, "Parking ID is required"),
  count: z.number().int().min(1, "Count must be at least 1"),
  vehicleType: z.nativeEnum(VehicleType),
});

export type UpdateSlotDto = z.infer<typeof updateSlotSchema>;
export type CreateBulkSlotsDto = z.infer<typeof createBulkSlotSchema>;
