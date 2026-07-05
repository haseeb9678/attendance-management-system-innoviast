
import type { ExportColumn } from "@/lib/csv";
import type { Subject } from "../types/subject.types";

const formatDate = (date?: string | Date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-GB");
};

export const subjectExportColumns: ExportColumn<Subject>[] = [
    {
        label: "Subject Name",
        key: "name",
    },
    {
        label: "Code",
        key: "code",
    },
    {
        label: "Department",
        value: (subject) => subject.department?.name ?? "--",
    },
    {
        label: "Description",
        value: (subject) => subject.description || "--",
    },
    {
        label: "Status",
        key: "status",
    },
    {
        label: "Created Date",
        value: (subject) => formatDate(subject.createdAt),
    },
];