import { z } from "zod";
import { selectOptionSchema } from "../utils/selectOption.schema";



export const sessionFormSchema = z.object({
    subject: selectOptionSchema("Subject"),

    class: selectOptionSchema("Class"),

    teacher: selectOptionSchema("Teacher"),

    dayOfWeek: selectOptionSchema("Day of Week"),

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

    status: selectOptionSchema("Status"),
});

export type SessionFormInput = z.infer<typeof sessionFormSchema>;