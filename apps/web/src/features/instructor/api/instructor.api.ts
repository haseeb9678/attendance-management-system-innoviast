import type { AttendanceHistoryFilters } from "@/features/attendance/types/attendance.types";
import { api } from "@/lib/axios";


/**
 * Get instructor class overview
 */
interface GetClassOverviewParams {
    classId: string;
    page: number;
    limit: number;
    search: string;
    sort: "newest" | "oldest";
}

export const getClassOverview = async ({
    classId,
    page,
    limit,
    search,
    sort,
}: GetClassOverviewParams) => {
    const { data } = await api.get(
        `/instructor/classes/${classId}`,
        {
            params: {
                page,
                limit,
                search,
                sort,
            },
        }
    );

    return data;
};
/**
 * Get attendance dashboard statistics
 */
export const getAttendanceStats = async () => {
    const { data } = await api.get(
        "/instructor/attendance-stats"
    );

    return data;
};

/**
 * Get instructor dashboard
 */
export const getInstructorDashboard = async () => {
    const { data } = await api.get(
        "/instructor/dashboard"
    );

    return data;
};

/**
 * Get attendance history
 */
export const getAttendanceHistory = async (
    filters: AttendanceHistoryFilters = {}
) => {
    const { data } = await api.get(
        "/instructor/attendance-history",
        {
            params: {
                page: filters.page,
                limit: filters.limit,
                search: filters.search,
                class: filters.class,
                subject: filters.subject,
                status: filters.status,
                sort: filters.sort,
            },
        }
    );

    return data;
};

export const getMyClasses = async () => {
    const { data } = await api.get("/instructor/classes");
    return data;
};

export const getMySubjects = async () => {
    const { data } = await api.get("/instructor/subjects");
    return data;
};

export const getMySessions = async () => {
    const { data } = await api.get("/instructor/sessions");
    return data;
};

export const getMyStudents = async (classId: string) => {
    const { data } = await api.get(
        `/instructor/students/${classId}`
    );

    return data;
};

export const updateInstructorProfile = async (data: any) => {
    const res = await api.put("/instructor/profile", data);
    return res;
};