import { z } from "zod";

export const createDepartmentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Department name must be at least 3 characters")
        .max(100, "Department name must not exceed 100 characters"),

    code: z
        .string()
        .trim()
        .min(2, "Department code is required")
        .max(10, "Department code must not exceed 10 characters")
        .transform((value) => value.toUpperCase()),

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

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;