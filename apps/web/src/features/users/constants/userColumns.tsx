import type { TableColumn } from "@/components/common/Table";
import DateTimeCell from "@/components/common/DateTimeCell";
import RoleBadge from "@/shared/components/RoleBadge";
import StatusBadge from "@/shared/components/StatusBadge";
import UserActions from "../components/UserActions";
import type { User } from "../types/user.types";
import LoginAtCell from "@/components/common/LoginAtCell";

interface UserColumnsProps {
    onView?: (user: User) => void;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
}

export const getUserColumns = ({
    onView,
    onEdit,
    onDelete,
}: UserColumnsProps): TableColumn<User>[] => [
        {
            key: "name",
            label: "Name",
            render: (row) => {
                return (
                    <div className="flex items-center gap-2">
                        <span>{row.name}</span>
                        {
                            row?.isDemo && <StatusBadge status={"demo"} />
                        }
                    </div>
                )
            }
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "phoneNumber",
            label: "Phone",
        },
        {
            key: "role",
            label: "Role",
            render: (row) => <RoleBadge role={row.role} />,
        },
        {
            key: "department",
            label: "Department",
            render: (row) => row.department?.name ?? "-",
        },
        {
            key: "status",
            label: "Status",
            render: (row) => (
                <StatusBadge status={row.status} />
            ),
        },
        {
            key: "lastLoginAt",
            label: "Last Login",
            render: (row) => (

                <LoginAtCell date={row?.lastLoginAt} />
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
                <UserActions
                    user={row}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];