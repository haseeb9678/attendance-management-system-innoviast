import type { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/shared/components/StatusBadge";
import type { Department } from "../types/department.types";
import DepartmentActions from "../components/DepartmentActions";
import DateTimeCell from "@/components/common/DateTimeCell";

export const departmentColumns: TableColumn<Department>[] = [
    {
        key: "name",
        label: "Department Name",

    },
    {
        key: "code",
        label: "Code",
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
        key: "createdAt",
        label: "Created Date",
        render: (row) => <DateTimeCell
            date={row.createdAt}
        />
    },
    {
        key: "actions",
        label: "Actions",
        align: "right",
        render: (row) => (
            <DepartmentActions department={row} />
        ),
    },
];