import { z } from "zod";
import { VehicleSize, VehicleType } from "@prisma/client";

export const createSlotSchema = z.object({
  parkingId: z
    .string({
      required_error: "Parking ID is required",
      invalid_type_error: "Parking ID must be a valid string",
    })
    .min(1, "Parking ID cannot be empty. Please provide a valid Parking ID."),
  size: z.nativeEnum(VehicleSize),
  vehicleType: z.nativeEnum(VehicleType),
  location: z.string({ required_error: "Parking spot location is required" }).min(1, "Please enter location, eg North section"),
});

export const updateSlotSchema = z.object({
  size: z.nativeEnum(VehicleSize).optional(),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  location: z.string().optional(),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"]).optional(),
});

export const createBulkSlotSchema = z.object({
  parkingId: z.string({ required_error: "Parking ID is required" }).min(1, "Parking ID is required"),
  location: z.string({ required_error: "Parking spot location is required" }).min(1, "Please enter location, eg North section"),
  count: z.number().int().min(1, "Count must be at least 1"),
  size: z.nativeEnum(VehicleSize),
  vehicleType: z.nativeEnum(VehicleType),
});

export type CreateSlotDto = z.infer<typeof createSlotSchema>;
export type UpdateSlotDto = z.infer<typeof updateSlotSchema>;
export type CreateBulkSlotsDto = z.infer<typeof createBulkSlotSchema>;
