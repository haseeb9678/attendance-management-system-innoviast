import type { SubjectFilters } from "../types/subject.types";

export const subjectKeys = {
    all: ["subjects"] as const,

    lists: () => [...subjectKeys.all, "list"] as const,

    list: (filters: SubjectFilters) =>
        [...subjectKeys.lists(), filters] as const,

    details: () => [...subjectKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...subjectKeys.details(), id] as const,
};