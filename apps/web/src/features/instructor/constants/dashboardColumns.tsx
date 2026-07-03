import type { TableColumn } from "@/components/common/Table";
import { formatDate } from "@/lib/date";
import StatusBadge from "@/shared/components/StatusBadge";

const recentSessionColumns: TableColumn<any>[] = [
    {
        key: "subject",
        label: "Subject",
        render: (row) => row.subject.name,
    },
    {
        key: "class",
        label: "Class",
        render: (row) => row.class.name,
    },
    {
        key: "room",
        label: "Room"
    },
    {
        key: "date",
        label: "Date",
        render: (row) => formatDate(row.date),
    },
    {
        key: "status",
        label: "Status"
    },
];