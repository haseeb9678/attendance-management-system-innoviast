import type { ExportColumn } from "@/lib/csv";

export type SessionAttendanceExportRow = {
    _id: string;
    status: string;
    remarks?: string;
    markedAt?: string | null;
    student?: {
        _id?: string | null;
        fullName?: string;
        email?: string;
        rollNumber?: string;
    };
};

export const sessionAttendanceExportColumns: ExportColumn<SessionAttendanceExportRow>[] =
    [
        {
            label: "Student Name",
            value: (row) =>
                row.student?.fullName ?? "--",
        },
        {
            label: "Roll Number",
            value: (row) =>
                row.student?.rollNumber ?? "--",
        },
        {
            label: "Email",
            value: (row) =>
                row.student?.email ?? "--",
        },
        {
            label: "Status",
            value: (row) => row.status || "--",
        },
        {
            label: "Remarks",
            value: (row) => row.remarks || "--",
        },
        {
            label: "Marked At",
            value: (row) =>
                row.markedAt
                    ? new Date(
                        row.markedAt
                    ).toLocaleString()
                    : "--",
        },
    ];