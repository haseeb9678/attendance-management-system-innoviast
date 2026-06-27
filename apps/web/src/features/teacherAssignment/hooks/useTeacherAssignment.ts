import { useQuery } from "@tanstack/react-query";
import {
    getTeacherAssignment,
    getTeacherAssignments,
} from "../api/teacherAssignment.api.js";
import { teacherAssignmentKeys } from "../api/teacherAssignment.keys.js";
import type { TeacherAssignmentFilters } from "../types/teacherAssignment.types";

export const useTeacherAssignments = (
    filters: TeacherAssignmentFilters = {}
) => {
    return useQuery({
        queryKey: teacherAssignmentKeys.list(filters),
        queryFn: () => getTeacherAssignments(filters),
    });
};

export const useTeacherAssignment = (
    id: string
) => {
    return useQuery({
        queryKey: teacherAssignmentKeys.detail(id),
        queryFn: () => getTeacherAssignment(id),
    });
};