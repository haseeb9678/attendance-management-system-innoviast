import { z } from "zod";

const ATTENDACE_STATUSES = [
    "present",
    "absent",
    "late",
    "excused",
] as const;




export const attendanceStudentSchema = z.object({
    student: z
        .string()
        .min(1, "Student is required."),

    status: z.enum(ATTENDACE_STATUSES, {
        message: "Attendance status is required.",
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
});

export const attendanceFormSchema = z.object({
    session: z
        .string()
        .min(1, "Session is required."),

    students: z
        .array(attendanceStudentSchema)
        .min(
            1,
            "At least one student attendance is required."
        )
});

export type AttendanceFormInput = z.infer<
    typeof attendanceFormSchema
>;