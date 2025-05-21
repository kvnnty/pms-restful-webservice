import { z } from "zod";

export const CreateBillDto = z.object({
  parkingSessionId: z.string().uuid(),
});

export type CreateBillInput = z.infer<typeof CreateBillDto>;
