import type { ExportColumn } from "@/lib/csv";
import type { AttendanceHistory } from "../types/attendance.types";

export const attendanceHistoryExportColumns: ExportColumn<AttendanceHistory>[] =
    [
        {
            label: "Date",
            value: (row) =>
                row.date
                    ? new Date(row.date).toLocaleDateString()
                    : "--",
        },
        {
            label: "Subject",
            value: (row) => row.subject?.name ?? "--",
        },
        {
            label: "Class",
            value: (row) => row.class?.name ?? "--",
        },
        {
            label: "Room",
            value: (row) => row.room || "--",
        },
        {
            label: "Time",
            value: (row) =>
                row.startTime && row.endTime
                    ? `${row.startTime} - ${row.endTime}`
                    : "--",
        },
        {
            label: "Status",
            key: "attendanceStatus",
        },
        {
            label: "Present",
            value: (row) => row.present ?? 0,
        },
        {
            label: "Absent",
            value: (row) => row.absent ?? 0,
        },
        {
            label: "Late",
            value: (row) => row.late ?? 0,
        },
        {
            label: "Excused",
            value: (row) => row.excused ?? 0,
        },
    ];