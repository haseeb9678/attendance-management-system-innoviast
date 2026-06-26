import { z } from "zod";
import { selectOptionSchema } from "../utils/selectOption.schema.js";


export const subjectFormSchema = z.object({
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

    department: selectOptionSchema("Department"),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional()
        .or(z.literal("")),

    status: selectOptionSchema("Status"),
});

export type SubjectFormInput = z.infer<typeof subjectFormSchema>;