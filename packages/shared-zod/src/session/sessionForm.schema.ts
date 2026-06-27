import { z } from "zod";
import { selectOptionSchema } from "../utils/selectOption.schema.js";

export const sessionFormSchema = z
    .object({
        teacherAssignment: selectOptionSchema(
            "Teacher Assignment"
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

        status: selectOptionSchema("Status"),
    })
    .refine(
        (data) => data.endTime > data.startTime,
        {
            message:
                "End time must be greater than start time.",
            path: ["endTime"],
        }
    );

export type SessionFormInput = z.infer<
    typeof sessionFormSchema
>;