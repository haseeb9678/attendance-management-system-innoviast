import { api } from "@/lib/axios";

export const getAdminDashboardStats = async () => {
    const { data } = await api.get("/admin/dashboard");
    return data;
};

export const updateAdminProfile = async (data: any) => {
    const res = await api.put("/admin/profile", data);
    return res;
};

/**
 * Update any user by admin
 */
export const updateUser = async (data: {
    id: string;
    name: string;
    phoneNumber: string;
    status: {
        label: string;
        value: string;
    };
}) => {
    const res = await api.put(
        "/admin/users/update",
        data
    );

    return res;
};

/**
 * Fixed attendance history stats + charts
 * This should NOT change with table pagination
 */
export const getAdminAttendanceHistoryStats = async () => {
    const { data } = await api.get(
        "/admin/attendance-history/stats"
    );

    return data;
};

/**
 * Paginated admin attendance history table
 * This changes with filters / search / page / limit
 */
export const getAdminAttendanceHistory = async (params?: {
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
}) => {
    const { data } = await api.get(
        "/admin/attendance-history",
        {
            params,
        }
    );

    return data;
};

/**
 * Get single session attendance details
 */
export const getAdminAttendanceSessionDetails = async (
    sessionId: string
) => {
    const { data } = await api.get(
        `/admin/attendance-history/${sessionId}`
    );

    return data;
};