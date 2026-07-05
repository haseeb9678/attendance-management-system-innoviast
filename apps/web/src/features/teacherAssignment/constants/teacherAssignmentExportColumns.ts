
import type { ExportColumn } from "@/lib/csv";
import type { TeacherAssignment } from "../types/teacherAssignment.types";

const formatDate = (date?: string | Date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-GB");
};

export const teacherAssignmentExportColumns: ExportColumn<TeacherAssignment>[] = [
    {
        label: "Department",
        value: (assignment) => assignment.department?.name ?? "--",
    },
    {
        label: "Instructor",
        value: (assignment) => assignment.instructor?.name ?? "--",
    },
    {
        label: "Instructor ID",
        value: (assignment) => assignment.instructor?.employeeId ?? "--",
    },
    {
        label: "Class",
        value: (assignment) => assignment.class?.name ?? "--",
    },
    {
        label: "Subject",
        value: (assignment) => assignment.subject?.name ?? "--",
    },
    {
        label: "Status",
        key: "status",
    },
    {
        label: "Created Date",
        value: (assignment) => formatDate(assignment.createdAt),
    },
];