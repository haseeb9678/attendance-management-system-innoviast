import { z } from "zod";

export const createSubjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Subject name must be at least 3 characters")
        .max(100, "Subject name must not exceed 100 characters"),

    code: z
        .string()
        .trim()
        .min(2, "Subject code is required")
        .max(20, "Subject code must not exceed 20 characters")
        .transform((value) => value.toUpperCase()),

    department: z
        .string()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid department ID"),

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

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;