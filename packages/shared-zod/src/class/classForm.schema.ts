import { z } from "zod";
import { selectOptionSchema } from "../utils/selectOption.schema.js";



export const classFormSchema = z.object({
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

    department: selectOptionSchema("Department"),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional()
        .or(z.literal("")),

    status: selectOptionSchema("Status"),
});

export type ClassFormInput = z.infer<typeof classFormSchema>;