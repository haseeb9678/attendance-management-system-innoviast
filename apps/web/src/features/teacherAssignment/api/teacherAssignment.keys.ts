import type { TeacherAssignmentFilters } from "../types/teacherAssignment.types";

export const teacherAssignmentKeys = {
    all: ["teacher-assignments"] as const,

    lists: () =>
        [...teacherAssignmentKeys.all, "list"] as const,

    list: (filters: TeacherAssignmentFilters) =>
        [...teacherAssignmentKeys.lists(), filters] as const,

    details: () =>
        [...teacherAssignmentKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...teacherAssignmentKeys.details(), id] as const,
};