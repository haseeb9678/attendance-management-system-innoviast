import type { ExportColumn } from "@/lib/csv";

import type { Department } from "../types/department.types";

const formatDate = (date?: string | Date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-GB");
};

export const departmentExportColumns: ExportColumn<Department>[] = [
    {
        label: "Department Name",
        key: "name",
    },
    {
        label: "Code",
        key: "code",
    },
    {
        label: "Description",
        value: (department) => department.description || "--",
    },
    {
        label: "Status",
        key: "status",
    },
    {
        label: "Created Date",
        value: (department) => formatDate(department.createdAt),
    },
];