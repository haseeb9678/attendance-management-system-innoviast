import { useQuery } from "@tanstack/react-query";

import {
    getClassOverview,
    getInstructorDashboard,
    getMyClasses,
    getMySessions,
    getMyStudents,
    getMySubjects,
} from "../api/instructor.api.js";

import { instructorKeys } from "../api/instructor.keys.js";

export const useInstructorDashboard = () => {
    return useQuery({
        queryKey: ["instructor-dashboard"],
        queryFn: getInstructorDashboard,
           refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

export const useClassOverview = ({
    classId,
    page,
    limit,
    search,
    sort,
}: {
    classId: string;
    page: number;
    limit: number;
    search: string;
    sort: "newest" | "oldest";
}) => {
    return useQuery({
        queryKey: instructorKeys.classOverview({
            classId,
            page,
            limit,
            search,
            sort,
        }),

        queryFn: () =>
            getClassOverview({
                classId,
                page,
                limit,
                search,
                sort,
            }),

        enabled: !!classId,
    });
};

export const useMyClasses = () => {
    return useQuery({
        queryKey: instructorKeys.classes(),
        queryFn: getMyClasses,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

export const useMySubjects = () => {
    return useQuery({
        queryKey: instructorKeys.subjects(),
        queryFn: getMySubjects,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

export const useMySessions = () => {
    return useQuery({
        queryKey: instructorKeys.sessions(),
        queryFn: getMySessions,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

export const useMyStudents = (classId: string) => {
    return useQuery({
        queryKey: instructorKeys.studentsByClass(classId),
        queryFn: () => getMyStudents(classId),
        enabled: !!classId,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};