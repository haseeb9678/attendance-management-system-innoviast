import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTeacherAssignmentSchema = z.object({
    department: z
        .string()
        .trim()
        .regex(objectIdRegex, "Invalid Instructor ID"),

    instructor: z
        .string()
        .trim()
        .regex(objectIdRegex, "Invalid Instructor ID"),

    class: z
        .string()
        .trim()
        .regex(objectIdRegex, "Invalid class ID"),

    subject: z
        .string()
        .trim()
        .regex(objectIdRegex, "Invalid subject ID"),

    status: z.enum(["active", "inactive"], {
        error: "Please provide a valid status.",
    }),
});

export type CreateTeacherAssignmentInput = z.infer<
    typeof createTeacherAssignmentSchema
>;