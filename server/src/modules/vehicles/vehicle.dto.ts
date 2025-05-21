import { VehicleType } from "@prisma/client";
import { z } from "zod";

export const registerVehicleDto = z.object({
  plateNumber: z
    .string({ required_error: "Plate number is required", invalid_type_error: "Plate number must be a string" })
    .nonempty({ message: "Please provide a plate number" })
    .length(7, { message: "Please enter a valid plate number e.g., RAH123U" })
    .regex(/^RA[A-H][0-9]{3}[A-Z]$/, {
      message: "Please enter a valid plate number e.g., RAH123U",
    }),

  vehicleType: z.nativeEnum(VehicleType, { required_error: "Vehicle type is required" }),
});

export const updateVehicleDto = z.object({
  plateNumber: z
    .string({ required_error: "Plate number is required", invalid_type_error: "Plate number must be a string" })
    .nonempty({ message: "Please provide a plate number" })
    .length(7, { message: "Please enter a valid vehicle plate number" })
    .regex(/^RA[A-H][0-9]{3}[A-Z]$/, {
      message: "Please enter a valid plate number e.g., RAH123U",
    }),

  vehicleType: z.nativeEnum(VehicleType, { required_error: "Vehicle type is required" }),

  attributes: z.record(z.any()),
});

export const plateNumberValidation = z.object({
  plateNumber: z
    .string({ required_error: "Plate number is required", invalid_type_error: "Plate number must be a string" })
    .nonempty({ message: "Please provide a plate number" })
    .length(7, { message: "Please enter a valid plate number e.g., RAH123U" })
    .regex(/^RA[A-H][0-9]{3}[A-Z]$/, {
      message: "Please enter a valid plate number e.g., RAH123U",
    }),
});

export type RegisterVehicleDto = z.infer<typeof registerVehicleDto>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleDto>;
