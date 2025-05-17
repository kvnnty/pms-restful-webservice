import { z } from "zod";

export const updateUserDto = z.object({
  firstName: z.string({ invalid_type_error: "First name must be a string" }).optional(),
  lastName: z.string({ invalid_type_error: "Last name must be a string" }).optional(),
  email: z.string({ invalid_type_error: "Email must be a string" }).email({ message: "Please enter a valid email address" }).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;
