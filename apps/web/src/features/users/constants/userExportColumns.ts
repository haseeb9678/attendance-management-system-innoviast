
import type { ExportColumn } from "@/lib/csv";
import type { User } from "../types/user.types";

export const userExportColumns: ExportColumn<User>[] = [
    {
        label: "Name",
        key: "name",
    },
    {
        label: "Email",
        key: "email",
    },
    {
        label: "Role",
        key: "role",
    },
    {
        label: "Status",
        key: "status",
    },
    {
        label: "Department",
        value: (user) => user.department?.name ?? "--",
    },
    {
        label: "Created At",
        value: (user) =>
            user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "--",
    },
];