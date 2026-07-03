import type { AttendanceHistoryFilters } from "../types/attendance.types";

export const attendanceKeys = {
    all: ["attendance"] as const,

    stats: () =>
        [...attendanceKeys.all, "stats"] as const,

    histories: () =>
        [...attendanceKeys.all, "history"] as const,

    history: (
        filters: AttendanceHistoryFilters
    ) =>
        [...attendanceKeys.histories(), filters] as const,

    sessions: () =>
        [...attendanceKeys.all, "session"] as const,

    session: (sessionId: string) =>
        [...attendanceKeys.sessions(), sessionId] as const,

    students: () =>
        [...attendanceKeys.all, "student"] as const,

    student: (studentId: string) =>
        [...attendanceKeys.students(), studentId] as const,
};