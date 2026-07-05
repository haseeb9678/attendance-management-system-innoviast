
import type { ExportColumn } from "@/lib/csv";
import type { Class } from "../types/class.types";

const formatDate = (date?: string | Date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-GB");
};

export const classExportColumns: ExportColumn<Class>[] = [
    {
        label: "Class Name",
        key: "name",
    },
    {
        label: "Code",
        key: "code",
    },
    {
        label: "Department",
        value: (classItem) => classItem.department?.name ?? "--",
    },
    {
        label: "Description",
        value: (classItem) => classItem.description || "--",
    },
    {
        label: "Status",
        key: "status",
    },
    {
        label: "Created Date",
        value: (classItem) => formatDate(classItem.createdAt),
    },
];