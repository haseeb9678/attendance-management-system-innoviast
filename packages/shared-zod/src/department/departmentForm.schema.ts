import { z } from "zod";
import { selectOptionSchema } from "../utils/selectOption.schema.js";


export const departmentFormSchema = z.object({
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

    status: selectOptionSchema("Status"),
});

export type DepartmentFormInput = z.infer<typeof departmentFormSchema>;