import type { TableColumn } from "@/components/common/Table";
import DateTimeCell from "@/components/common/DateTimeCell";
import StatusBadge from "@/shared/components/StatusBadge";

import SessionActions from "../components/SessionActions";
import type { Session } from "../types/session.types";
import SessionTimeCell from "@/components/common/SessionTimeCell";

interface SessionColumnsProps {
    onView?: (session: Session) => void;
    onEdit?: (session: Session) => void;
    onDelete?: (session: Session) => void;
}

export const getSessionColumns = ({
    onView,
    onEdit,
    onDelete,
}: SessionColumnsProps): TableColumn<Session>[] => [
        {
            key: "instructor",
            label: "Instructor",
            render: (row) =>
                row.teacherAssignment.instructor.name,
        },
        {
            key: "subject",
            label: "Subject",
            render: (row) =>
                row.teacherAssignment.subject.name,
        },
        {
            key: "class",
            label: "Class",
            render: (row) =>
                `${row.teacherAssignment.class.name} (${row.teacherAssignment.class.code})`,
        },
        {
            key: "date",
            label: "Session Date",
            render: (row) => (
                <DateTimeCell date={row.date} />
            ),
        },
        {
            key: "time",
            label: "Time",
            render: (row) => (
                <SessionTimeCell
                    startTime={row.startTime}
                    endTime={row.endTime}
                />
            ),
        },
        {
            key: "room",
            label: "Room",
            render: (row) => row.room || "--",
        },
        {
            key: "status",
            label: "Status",
            render: (row) => (
                <StatusBadge status={row.status} />
            ),
        },
        {
            key: "createdAt",
            label: "Created Date",
            render: (row) => (
                <DateTimeCell date={row.createdAt} />
            ),
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (row) => (
                <SessionActions
                    session={row}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];