import { api } from "@/lib/axios";
import type {
    TeacherAssignment,
    TeacherAssignmentFilters,
} from "../types/teacherAssignment.types";
import type { CreateTeacherAssignmentInput } from "@attendance/shared-zod";

export const getTeacherAssignments = async (
    filters: TeacherAssignmentFilters = {}
) => {
    const { data } = await api.get("/teacher-assignments", {
        params: {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            department: filters.department,
            instructor: filters.instructor,
            class: filters.class,
            subject: filters.subject,
            status: filters.status,
            sort: filters.sort,
        },
    });

    return data;
};

export const getTeacherAssignment = async (
    id: string
) => {
    const { data } =
        await api.get(
            `/teacher-assignments/${id}`
        );

    return data.data as TeacherAssignment;
};

export const createTeacherAssignment = async (
    body: CreateTeacherAssignmentInput
) => {
    const { data } = await api.post(
        "/teacher-assignments",
        body
    );

    return data;
};

export const updateTeacherAssignment = async ({
    id,
    body,
}: {
    id: string;
    body: CreateTeacherAssignmentInput;
}) => {
    const { data } = await api.put(
        `/teacher-assignments/${id}`,
        body
    );

    return data;
};

export const deleteTeacherAssignment = async (
    id: string
) => {
    const { data } = await api.delete(
        `/teacher-assignments/${id}`
    );

    return data;
};