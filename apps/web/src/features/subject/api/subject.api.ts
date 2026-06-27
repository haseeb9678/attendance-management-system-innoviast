import { api } from "@/lib/axios";
import type {
    Subject,
    SubjectFilters,
} from "../types/subject.types";
import type { CreateSubjectInput } from "@attendance/shared-zod";

export const getSubjects = async (
    filters: SubjectFilters = {}
) => {
    const { data } = await api.get("/subjects", {
        params: {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            department: filters.department,
            status: filters.status,
            sort: filters.sort,
        },
    });

    return data;
};

export const getSubject = async (id: string) => {
    const { data } = await api.get<Subject>(`/subjects/${id}`);
    return data;
};

export const createSubject = async (
    body: CreateSubjectInput
) => {
    const { data } = await api.post("/subjects", body);
    return data;
};

export const updateSubject = async ({
    id,
    body,
}: {
    id: string;
    body: CreateSubjectInput;
}) => {
    const { data } = await api.put(
        `/subjects/${id}`,
        body
    );

    return data;
};

export const deleteSubject = async (id: string) => {
    const { data } = await api.delete(`/subjects/${id}`);
    return data;
};