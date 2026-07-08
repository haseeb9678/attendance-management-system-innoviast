import { useQuery } from "@tanstack/react-query";
import {
    getAdminDashboardStats,
    getAdminAttendanceHistoryStats,
    getAdminAttendanceHistory,
    getAdminAttendanceSessionDetails,
} from "../api/admin.api.js";

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: getAdminDashboardStats,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

type AdminAttendanceHistoryParams = {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
    classId?: string;
    subjectId?: string;
    instructorId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?:
    | "newest"
    | "oldest"
    | "highest_attendance"
    | "lowest_attendance";
};

/**
 * Fixed top cards + charts
 * Should not change on table pagination
 */
export const useAdminAttendanceHistoryStats = () => {
    return useQuery({
        queryKey: ["admin-attendance-history-stats"],
        queryFn: getAdminAttendanceHistoryStats,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

/**
 * Paginated/filterable table data
 */
export const useAdminAttendanceHistory = (
    params?: AdminAttendanceHistoryParams
) => {
    return useQuery({
        queryKey: ["admin-attendance-history", params],
        queryFn: () =>
            getAdminAttendanceHistory(params),
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};

/**
 * Single session attendance details
 */
export const useAdminAttendanceSessionDetails = (
    sessionId?: string
) => {
    return useQuery({
        queryKey: [
            "admin-attendance-session-details",
            sessionId,
        ],
        queryFn: () =>
            getAdminAttendanceSessionDetails(
                sessionId as string
            ),
        enabled: !!sessionId,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 5000,
    });
};