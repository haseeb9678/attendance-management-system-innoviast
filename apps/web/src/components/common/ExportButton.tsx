import { LucideUpload } from "lucide-react";
import FormButton from "./FormButton";
import { exportToCsv, type ExportColumn } from "@/lib/csv";


interface ExportButtonProps<T> {
    data: T[];
    selectedRowIds: (string | number)[];
    getRowId: (row: T, index: number) => string | number;
    columns: ExportColumn<T>[];
    fileName?: string;
    text?: string;
    className?: string;
}

const ExportButton = <T,>({
    data,
    selectedRowIds,
    getRowId,
    columns,
    fileName = "export",
    text = "Export",
    className = "",
}: ExportButtonProps<T>) => {
    const handleExport = () => {
        if (!data.length || selectedRowIds.length === 0) return;

        const selectedRows = data.filter((row, index) =>
            selectedRowIds.includes(getRowId(row, index))
        );

        exportToCsv({
            data: selectedRows,
            columns,
            fileName: fileName + "_attendix_" + new Date().getTime(),
        });
    };

    return (
        <FormButton
            type="button"
            text={text}
            Icon={LucideUpload}
            disabled={selectedRowIds.length === 0}
            onClick={handleExport}
            className={`
                min-w-max h-10! px-5 text-sm
                bg-warning hover:bg-warning-hover
                ${className}
            `}
        />
    );
};

export default ExportButton;