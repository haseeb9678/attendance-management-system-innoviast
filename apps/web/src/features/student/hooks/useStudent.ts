import { useQuery } from "@tanstack/react-query";

import {
    getStudentDashboard,
    getMyClass,
    getMySubjects,
    getMySessions,
    getMyAttendanceStats,
    getMyAttendanceHistory,
    getStudentAttendanceSubjectDetails,
} from "../api/student.api.js";

import { studentKeys } from "../api/student.keys.js";

/**
 * Student Dashboard
 */
export const useStudentDashboard = () => {
    return useQuery({
        queryKey: studentKeys.dashboard(),
        queryFn: getStudentDashboard,
    });
};

/**
 * My Class
 */
export const useMyClass = () => {
    return useQuery({
        queryKey: studentKeys.class(),
        queryFn: getMyClass,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

/**
 * My Subjects
 */
export const useMySubjects = () => {
    return useQuery({
        queryKey: studentKeys.subjects(),
        queryFn: getMySubjects,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

/**
 * My Sessions
 */
export const useMySessions = () => {
    return useQuery({
        queryKey: studentKeys.sessions(),
        queryFn: getMySessions,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

/**
 * My Attendance Stats
 */
export const useMyAttendanceStats = () => {
    return useQuery({
        queryKey: studentKeys.attendance(),
        queryFn: getMyAttendanceStats,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

/**
 * My Attendance History
 * Subject-wise attendance summary
 */
export const useMyAttendanceHistory = ({
    search,
    sort,
}: {
    search?: string;
    sort?: "newest" | "oldest";
}) => {
    return useQuery({
        queryKey: studentKeys.attendanceHistory({
            search,
            sort,
        }),

        queryFn: () =>
            getMyAttendanceHistory({
                search,
                sort,
            }),
    });
};

/**
 * Student Attendance Subject Details
 * Session-wise details of a subject
 */
export const useStudentAttendanceSubjectDetails = ({
    subjectId,
    page,
    limit,
    search,
    sort,
}: {
    subjectId: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: "newest" | "oldest";
}) => {
    return useQuery({
        queryKey:
            studentKeys.attendanceSubjectDetails({
                subjectId,
                page,
                limit,
                search,
                sort,
            }),

        queryFn: () =>
            getStudentAttendanceSubjectDetails({
                subjectId,
                page,
                limit,
                search,
                sort,
            }),

        enabled: !!subjectId,
    });
};