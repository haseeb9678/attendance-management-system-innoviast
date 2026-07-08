import { z } from "zod";
import { selectOptionSchema } from "../utils/selectOption.schema";

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

export const adminUpdateUserFormSchema = z.object({
    id: z
        .string()
        .trim()
        .min(1, "ID is required"),

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

    status: selectOptionSchema("Status"),


    currentPassword: z
        .string()
        .min(1, "Current password is required"),
});

export type AdminUpdateUserFormInput = z.infer<
    typeof adminUpdateUserFormSchema
>;

export const adminUpdateUserSchema = z.object({
    id: z
        .string()
        .trim()
        .min(1, "ID is required"),

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

    status: z.enum(["active", "inactive", "suspended"], {
        error: "Please provide a valid status.",
    }),


    currentPassword: z
        .string()
        .min(1, "Current password is required"),
});

export type AdminUpdateUserInput = z.infer<
    typeof adminUpdateUserSchema
>;