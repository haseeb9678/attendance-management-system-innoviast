import { api } from "@/lib/axios";

/**
 * Get student dashboard
 */
export const getStudentDashboard = async () => {
    const { data } = await api.get("/student/dashboard");
    return data;
};

/**
 * Get my class
 */
export const getMyClass = async () => {
    const { data } = await api.get("/student/class");
    return data;
};

/**
 * Get my subjects
 */
export const getMySubjects = async () => {
    const { data } = await api.get("/student/subjects");
    return data;
};

/**
 * Get my sessions
 */
export const getMySessions = async () => {
    const { data } = await api.get("/student/sessions");
    return data;
};

/**
 * Get my attendance stats
 */
export const getMyAttendanceStats = async () => {
    const { data } = await api.get("/student/attendance");
    return data;
};

/**
 * Get my attendance history summary
 * Subject-wise attendance overview
 */
export const getMyAttendanceHistory = async (filters?: {
    search?: string;
    sort?: "newest" | "oldest";
}) => {
    const { data } = await api.get(
        "/student/attendance/history",
        {
            params: {
                search: filters?.search,
                sort: filters?.sort,
            },
        }
    );

    return data;
};

/**
 * Get student attendance subject details
 * Session-wise attendance details of a subject
 */
export const getStudentAttendanceSubjectDetails = async ({
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
    const { data } = await api.get(
        `/student/attendance/history/subject/${subjectId}`,
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
 * Update student profile
 */
export const updateStudentProfile = async (data: any) => {
    const res = await api.put("/student/profile", data);
    return res;
};