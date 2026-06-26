import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSessionSchema = z.object({
    subject: z
        .string()
        .regex(objectIdRegex, "Invalid subject ID"),

    class: z
        .string()
        .regex(objectIdRegex, "Invalid class ID"),

    teacher: z
        .string()
        .regex(objectIdRegex, "Invalid teacher ID"),

    dayOfWeek: z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ], {
        error: "Please provide a valid day.",
    }),

    startTime: z
        .string()
        .min(1, "Start time is required"),

    endTime: z
        .string()
        .min(1, "End time is required"),

    room: z
        .string()
        .trim()
        .max(50, "Room must not exceed 50 characters")
        .optional()
        .or(z.literal("")),

    status: z.enum(["active", "inactive"], {
        error: "Please provide a valid status.",
    }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;