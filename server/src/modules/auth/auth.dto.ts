import { z } from "zod";

export const loginDto = z.object({
  email: z
    .string({ required_error: "Email is required", invalid_type_error: "Email must be a string" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be a string" }),
});

export type LoginUserDto = z.infer<typeof loginDto>;
