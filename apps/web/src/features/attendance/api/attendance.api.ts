import { api } from "@/lib/axios";

import type { AttendanceHistoryFilters, CreateAttendanceInput } from "../types/attendance.types";



/**
 * Get attendance for a session
 */
export const getSessionAttendance = async (
    sessionId: string
) => {
    const { data } = await api.get(
        `/attendance/session/${sessionId}`
    );

    return data;
};

/**
 * Get attendance for a student
 */
export const getStudentAttendance = async (
    studentId: string
) => {
    const { data } = await api.get(
        `/attendance/student/${studentId}`
    );

    return data;
};

/**
 * Create attendance
 */
export const createAttendance = async (
    body: CreateAttendanceInput
) => {
    const { data } = await api.post(
        "/attendance",
        body
    );

    return data;
};

/**
 * Update attendance
 */
export const updateAttendance = async ({
    sessionId,
    body,
}: {
    sessionId: string;
    body: CreateAttendanceInput;
}) => {
    const { data } = await api.put(
        `/attendance/session/${sessionId}`,
        body
    );

    return data;
};

/**
 * Delete attendance
 */
export const deleteAttendance = async (
    sessionId: string
) => {
    const { data } = await api.delete(
        `/attendance/session/${sessionId}`
    );

    return data;
};