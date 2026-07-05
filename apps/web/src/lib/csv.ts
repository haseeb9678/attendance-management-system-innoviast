export type ExportColumn<T> = {
    label: string;
    key?: keyof T;
    value?: (row: T) => unknown;
};

const escapeCsvValue = (value: unknown) => {
    if (value === null || value === undefined) return "";

    const stringValue = String(value);

    // Escape quotes by doubling them
    const escaped = stringValue.replace(/"/g, '""');

    // Wrap in quotes if contains comma, quote or newline
    if (/[",\n]/.test(escaped)) {
        return `"${escaped}"`;
    }

    return escaped;
};

export const exportToCsv = <T,>({
    data,
    columns,
    fileName = "export",
}: {
    data: T[];
    columns: ExportColumn<T>[];
    fileName?: string;
}) => {
    if (!data.length || !columns.length) return;

    const headers = columns.map((column) => column.label);

    const rows = data.map((row) =>
        columns.map((column) => {
            let value: unknown = "";

            if (column.value) {
                value = column.value(row);
            } else if (column.key) {
                value = row[column.key];
            }

            return escapeCsvValue(value);
        })
    );

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};