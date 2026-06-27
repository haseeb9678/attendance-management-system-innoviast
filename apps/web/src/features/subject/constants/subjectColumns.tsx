import type { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/shared/components/StatusBadge";
import type { Subject } from "../types/subject.types";
import SubjectActions from "../components/SubjectActions";
import DateTimeCell from "@/components/common/DateTimeCell";

export const subjectColumns: TableColumn<Subject>[] = [
    {
        key: "name",
        label: "Subject Name",
    },
    {
        key: "code",
        label: "Code",
    },
    {
        key: "department",
        label: "Department",
        render: (row) => row.department.name,
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
            <SubjectActions subject={row} />
        ),
    },
];