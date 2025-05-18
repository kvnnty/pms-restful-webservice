import { z } from "zod";

export const createParkingDto = z.object({
  name: z
    .string({ required_error: "Parking name is required", invalid_type_error: "Parking name must be a string" })
    .min(1, { message: "Please enter parking name" }),
  address: z
    .string({ required_error: "Parking address is required", invalid_type_error: "Parking address must be a string" })
    .min(1, { message: "Please enter parking address" }),
  pricePerHour: z.number({ required_error: "Parking price per hour rate is required" }).positive(),
  capacity: z.number({ required_error: "Parking capacity is required" }).int().positive(),
});

export const updateParkingDto = createParkingDto.partial();

export type CreateParkingDto = z.infer<typeof createParkingDto>;
export type UpdateParkingDto = z.infer<typeof updateParkingDto>;
