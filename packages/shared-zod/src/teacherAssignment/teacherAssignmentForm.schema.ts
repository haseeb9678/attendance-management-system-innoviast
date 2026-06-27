import { z } from "zod";
import { selectOptionSchema } from "../utils/selectOption.schema.js";

export const teacherAssignmentFormSchema = z.object({
    department: selectOptionSchema("Department"),
    instructor: selectOptionSchema("Instructor"),

    class: selectOptionSchema("Class"),

    subject: selectOptionSchema("Subject"),

    status: selectOptionSchema("Status"),
});

export type TeacherAssignmentFormInput = z.infer<
    typeof teacherAssignmentFormSchema
>;