import { z } from "zod";

export const createClassSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Class name must be at least 3 characters")
        .max(100, "Class name must not exceed 100 characters"),

    code: z
        .string()
        .trim()
        .min(2, "Class code is required")
        .max(20, "Class code must not exceed 20 characters")
        .transform((value) => value.toUpperCase()),

    department: z
        .string()
        .trim()
        .min(1, "Department is required"),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional()
        .or(z.literal("")),

    status: z.enum(["active", "inactive"], {
        error: "Please provide a valid status.",
    }),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;