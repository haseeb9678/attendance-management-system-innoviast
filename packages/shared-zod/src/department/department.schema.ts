import { z } from "zod";

const selectOptionSchema = z.object({
    label: z.string(),
    value: z.string(),
});

export const departmentSchema = z.object({
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

    status: selectOptionSchema,
});

export type DepartmentSchema = z.infer<typeof departmentSchema>;