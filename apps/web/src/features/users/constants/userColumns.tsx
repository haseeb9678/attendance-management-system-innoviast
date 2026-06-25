import RoleBadge from "@/shared/components/RoleBadge";
import StatusBadge from "@/shared/components/StatusBadge";
import UserActions from "../components/UserActions";
import type { User } from "../types/user.types";
import type { TableColumn } from "@/components/common/Table";


export const userColumns: TableColumn<User>[] = [
    {
        key: "name",
        label: "Name",
    },
    {
        key: "email",
        label: "Email",
    },
    {
        key: "role",
        label: "Role",
        render: (row) => <RoleBadge role={row.role} />,
    },
    {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge status={row.status} />,
    },
    {
        key: "actions",
        label: "Actions",
        align: "right",
        render: (row) => <UserActions user={row} />,
    },
];