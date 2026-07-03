import { useQuery } from "@tanstack/react-query";

import {
    getSessionAttendance,
    getStudentAttendance,
} from "../api/attendance.api";

import { attendanceKeys } from "../api/attendance.keys";
import type { AttendanceHistoryFilters } from "../types/attendance.types";
import { getAttendanceHistory, getAttendanceStats } from "@/features/instructor/api/instructor.api";

/**
 * Attendance Statistics
 */
export const useAttendanceStats = () => {
    return useQuery({
        queryKey: attendanceKeys.stats(),
        queryFn: getAttendanceStats,
    });
};

/**
 * Attendance History
 */
export const useAttendanceHistory = (
    filters: AttendanceHistoryFilters = {}
) => {
    return useQuery({
        queryKey: attendanceKeys.history(filters),
        queryFn: () =>
            getAttendanceHistory(filters),
    });
};

export const useSessionAttendance = (
    sessionId: string
) => {
    return useQuery({
        queryKey: attendanceKeys.session(sessionId),
        queryFn: () =>
            getSessionAttendance(sessionId),
        enabled: !!sessionId,
    });
};

export const useStudentAttendance = (
    studentId: string
) => {
    return useQuery({
        queryKey: attendanceKeys.student(studentId),
        queryFn: () =>
            getStudentAttendance(studentId),
        enabled: !!studentId,
    });
};