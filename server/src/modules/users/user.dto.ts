import { z } from "zod";

export const createUserDto = z.object({
  firstName: z
    .string({ required_error: "First name is required", invalid_type_error: "First name must be a string" })
    .min(1, { message: "First name cannot be empty" }),
  lastName: z
    .string({ required_error: "Last name is required", invalid_type_error: "Last name must be a string" })
    .min(1, { message: "Last name cannot be empty" }),
  email: z
    .string({ required_error: "Email is required", invalid_type_error: "Email must be a string" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one digit" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),
});

export const updateUserDto = z.object({
  firstName: z.string({ invalid_type_error: "First name must be a string" }).optional(),
  lastName: z.string({ invalid_type_error: "Last name must be a string" }).optional(),
  email: z.string({ invalid_type_error: "Email must be a string" }).email({ message: "Please enter a valid email address" }).optional(),
});

export type CreateUserDto = z.infer<typeof createUserDto>;
export type UpdateUserDto = z.infer<typeof updateUserDto>;
