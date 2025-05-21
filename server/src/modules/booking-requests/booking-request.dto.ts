import { z } from "zod";

export const CreateSlotRequestDto = z.object({
  vehicleId: z.string({ required_error: "Vehicle ID is required" }).uuid("Invalid vehicle ID format"),
  slotId: z.string({ required_error: "Slot ID is required" }).uuid("Invalid slot ID format"),
});

export const UpdateSlotRequestDto = z.object({
  vehicleId: z.string({ required_error: "Vehicle ID is required" }).uuid("Invalid vehicle ID format"),
});

export const DecisionDto = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    errorMap: () => ({ message: "Status must be either APPROVED or REJECTED" }),
  }),
});

export type CreateSlotRequestDto = z.infer<typeof CreateSlotRequestDto>;
export type UpdateSlotRequestDto = z.infer<typeof UpdateSlotRequestDto>;
export type DecisionDto = z.infer<typeof DecisionDto>;
