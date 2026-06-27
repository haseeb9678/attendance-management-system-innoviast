import { useQuery } from "@tanstack/react-query";
import { getSubject, getSubjects } from "../api/subject.api.js";
import { subjectKeys } from "../api/subject.keys.js";
import type { SubjectFilters } from "../types/subject.types";

export const useSubjects = (
    filters: SubjectFilters = {}
) => {
    return useQuery({
        queryKey: subjectKeys.list(filters),
        queryFn: () => getSubjects(filters),
    });
};

export const useSubject = (id: string) => {
    return useQuery({
        queryKey: subjectKeys.detail(id),
        queryFn: () => getSubject(id),
    });
};