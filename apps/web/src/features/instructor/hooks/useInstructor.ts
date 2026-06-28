import { useQuery } from "@tanstack/react-query";

import {
    getMyClasses,
    getMySessions,
    getMyStudents,
    getMySubjects,
} from "../api/instructor.api.js";

import { instructorKeys } from "../api/instructor.keys.js";

export const useMyClasses = () => {
    return useQuery({
        queryKey: instructorKeys.classes(),
        queryFn: getMyClasses,
    });
};

export const useMySubjects = () => {
    return useQuery({
        queryKey: instructorKeys.subjects(),
        queryFn: getMySubjects,
    });
};

export const useMySessions = () => {
    return useQuery({
        queryKey: instructorKeys.sessions(),
        queryFn: getMySessions,
    });
};

export const useMyStudents = (classId: string) => {
    return useQuery({
        queryKey: instructorKeys.studentsByClass(classId),
        queryFn: () => getMyStudents(classId),
        enabled: !!classId,
    });
};