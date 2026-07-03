import type { TableColumn } from "@/components/common/Table";
import DateTimeCell from "@/components/common/DateTimeCell";
import StatusBadge from "@/shared/components/StatusBadge";

import type { AttendanceHistory } from "../types/attendance.types";
import AttendanceHistoryActions from "../components/AttendanceHistoryActions";

export const getAttendanceHistoryColumns = ({
    onView,
}: {
    onView: (
        attendance: AttendanceHistory
    ) => void;
}): TableColumn<AttendanceHistory>[] => [
        {
            key: "date",
            label: "Date",
            render: (row) => (
                <DateTimeCell
                    date={row.date}
                    showTime={false}
                />
            ),
        },

        {
            key: "subject",
            label: "Subject",
            render: (row) =>
                row.subject?.name ?? "--",
        },

        {
            key: "class",
            label: "Class",
            render: (row) =>
                row.class?.name ?? "--",
        },

        {
            key: "room",
            label: "Room",
            render: (row) =>
                row.room || "--",
        },

        {
            key: "time",
            label: "Time",
            render: (row) =>
                `${row.startTime} - ${row.endTime}`,
        },

        {
            key: "attendanceStatus",
            label: "Status",
            render: (row) => (
                <StatusBadge
                    status={row.attendanceStatus}
                />
            ),
        },

        {
            key: "present",
            label: "Present",
            align: "center",
        },

        {
            key: "absent",
            label: "Absent",
            align: "center",
        },

        {
            key: "late",
            label: "Late",
            align: "center",
        },

        {
            key: "excused",
            label: "Excused",
            align: "center",
        },

        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (row) => (
                <AttendanceHistoryActions
                    attendance={row}
                    onView={onView}
                />
            ),
        },
    ];