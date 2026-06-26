import type { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/shared/components/StatusBadge";
import type { Class } from "../types/class.types";
import ClassActions from "../components/ClassActions";

export const classColumns: TableColumn<Class>[] = [
    {
        key: "name",
        label: "Class Name",
    },
    {
        key: "code",
        label: "Code",
    },
    {
        key: "department",
        label: "Department",
        render: (row) => row.department?.name ?? "--",
    },
    {
        key: "description",
        label: "Description",
        cellClassName: "max-w-72 truncate",
        render: (row) => row.description || "--",
    },
    {
        key: "status",
        label: "Status",
        render: (row) => (
            <StatusBadge status={row.status} />
        ),
    },
    {
        key: "actions",
        label: "Actions",
        align: "right",
        render: (row) => (
            <ClassActions classItem={row} />
        ),
    },
];