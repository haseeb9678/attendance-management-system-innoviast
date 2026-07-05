import type { ExportColumn } from "@/lib/csv";
import type { Session } from "../types/session.types";

const formatDate = (date?: string | Date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-GB");
};

const formatTime = (time?: string) => {
    if (!time) return "--";

    const [hours, minutes] = time.split(":");
    const hour = Number(hours);

    if (Number.isNaN(hour)) return time;

    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${suffix}`;
};

export const sessionExportColumns: ExportColumn<Session>[] = [
    {
        label: "Instructor",
        value: (session) =>
            session.teacherAssignment?.instructor?.name ?? "--",
    },
    {
        label: "Subject",
        value: (session) =>
            session.teacherAssignment?.subject?.name ?? "--",
    },
    {
        label: "Class",
        value: (session) => {
            const classItem = session.teacherAssignment?.class;

            if (!classItem) return "--";

            return `${classItem.name} (${classItem.code})`;
        },
    },
    {
        label: "Session Date",
        value: (session) => formatDate(session.date),
    },
    {
        label: "Start Time",
        value: (session) => formatTime(session.startTime),
    },
    {
        label: "End Time",
        value: (session) => formatTime(session.endTime),
    },
    {
        label: "Room",
        value: (session) => session.room || "--",
    },
    {
        label: "Status",
        key: "status",
    },
    {
        label: "Created Date",
        value: (session) => formatDate(session.createdAt),
    },
];