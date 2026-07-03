import { z } from "zod";

export const createAttendanceSchema = z.object({
    session: z
        .string()
        .trim()
        .min(1, "Session is required."),

    students: z
        .array(
            z.object({
                student: z
                    .string()
                    .trim()
                    .min(1, "Student is required."),

                status: z.enum(
                    [
                        "present",
                        "absent",
                        "late",
                        "excused",
                    ],
                    {
                        error:
                            "Please provide a valid attendance status.",
                    }
                ),

                remarks: z
                    .string()
                    .trim()
                    .max(
                        250,
                        "Remarks must not exceed 250 characters."
                    )
                    .optional()
                    .or(z.literal("")),
            })
        )
        .min(
            1,
            "At least one student attendance is required."
        ),
});

export type CreateAttendanceInput = z.infer<
    typeof createAttendanceSchema
>;