import { z } from "zod";

export const updateUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters"),

    phoneNumber: z
        .string()
        .trim()
        .regex(
            /^\d{11}$/,
            "Phone number must be exactly 11 digits"
        ),

    currentPassword: z
        .string()
        .min(1, "Current password is required"),
});

export type UpdateUserInput = z.infer<
    typeof updateUserSchema
>;