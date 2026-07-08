import type { ExportColumn } from "@/lib/csv";

export type AdminAttendanceHistoryRow = {
    _id: string;
    status: string;
    sessionDate?: string;
    createdAt?: string;

    subject?: {
        _id?: string;
        name?: string;
        code?: string;
    };

    class?: {
        _id?: string;
        name?: string;
        section?: string;
        semester?: number;
    };

    department?: {
        _id?: string;
        name?: string;
    };

    instructor?: {
        _id?: string;
        fullName?: string;
        email?: string;
    };

    attendanceSummary?: {
        totalStudents?: number;
        present?: number;
        absent?: number;
        late?: number;
        excused?: number;
        attendanceRate?: number;
    };
};

export const adminAttendanceHistoryExportColumns: ExportColumn<AdminAttendanceHistoryRow>[] =
    [
        {
            label: "Subject",
            value: (row) => row.subject?.name ?? "--",
        },
        {
            label: "Class",
            value: (row) =>
                `${row.class?.name ?? "--"}${row.class?.section
                    ? ` (${row.class.section})`
                    : ""
                }`,
        },
        {
            label: "Department",
            value: (row) =>
                row.department?.name ?? "--",
        },
        {
            label: "Instructor",
            value: (row) =>
                row.instructor?.fullName ||
                row.instructor?.email ||
                "--",
        },
        {
            label: "Session Date",
            value: (row) =>
                row.sessionDate
                    ? new Date(
                        row.sessionDate
                    ).toLocaleDateString()
                    : row.createdAt
                        ? new Date(
                            row.createdAt
                        ).toLocaleDateString()
                        : "--",
        },
        {
            label: "Present",
            value: (row) =>
                row.attendanceSummary?.present ?? 0,
        },
        {
            label: "Absent",
            value: (row) =>
                row.attendanceSummary?.absent ?? 0,
        },
        {
            label: "Late",
            value: (row) =>
                row.attendanceSummary?.late ?? 0,
        },
        {
            label: "Excused",
            value: (row) =>
                row.attendanceSummary?.excused ?? 0,
        },
        {
            label: "Attendance %",
            value: (row) =>
                `${row.attendanceSummary?.attendanceRate ?? 0}%`,
        },
        {
            label: "Status",
            value: (row) => row.status || "--",
        },
    ];