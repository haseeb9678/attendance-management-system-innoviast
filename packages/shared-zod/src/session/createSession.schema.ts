import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSessionSchema = z
    .object({
        teacherAssignment: z
            .string()
            .regex(
                objectIdRegex,
                "Invalid teacher assignment ID"
            ),

        date: z
            .string()
            .min(1, "Session date is required"),

        startTime: z
            .string()
            .min(1, "Start time is required"),

        endTime: z
            .string()
            .min(1, "End time is required"),

        room: z
            .string()
            .trim()
            .max(
                50,
                "Room must not exceed 50 characters"
            )
            .optional()
            .or(z.literal("")),

        status: z.enum(
            [
                "scheduled",
                "ongoing",
                "completed",
                "cancelled",
            ],
            {
                error: "Please provide a valid status.",
            }
        ),
    })
    .refine(
        (data) => data.startTime < data.endTime,
        {
            message:
                "End time must be after start time.",
            path: ["endTime"],
        }
    );

export type CreateSessionInput = z.infer<
    typeof createSessionSchema
>;