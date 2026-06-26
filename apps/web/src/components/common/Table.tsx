import type { ReactNode } from "react";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";

export interface TableColumn<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    align?: "left" | "center" | "right";
    cellClassName?: string;
    render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends { id: string | number }> {
    columns: TableColumn<T>[];
    data?: T[];
    loading?: boolean;
    showCheckbox?: boolean;
    skeletonLength?: number;
}

const DataTable = <T extends { id: string | number }>({
    columns,
    data = [],
    loading = false,
    showCheckbox = true,
    skeletonLength = 5,
}: DataTableProps<T>) => {
    const checkboxClass =
        `h-4! w-4! border-2 border-gray-400 data-[state=checked]:bg-primary 
      data-[state=checked]:border-primary data-[state=checked]:text-white`;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead
                    className="
            sticky top-0 z-2
            h-6 border-y border-border bg-surface
            [&_th]:whitespace-nowrap
            [&_th]:p-5
            [&_th]:px-8
          
            [&_th]:font-medium!
            text-text-secondary/80 uppercase 
          "
                >
                    <tr>
                        {showCheckbox && (
                            <th className="w-10">
                                <Checkbox className={checkboxClass} />
                            </th>
                        )}

                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                style={{ width: column.width }}
                                className={
                                    column.align === "center"
                                        ? "text-center"
                                        : column.align === "right"
                                            ? "text-right"
                                            : "text-left"
                                }
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody
                    className="
            divide-y divide-border
            [&_tr:hover]:bg-surface/70
            [&_td]:whitespace-nowrap
            [&_td]:p-5
            [&_td]:px-8
            [&_td]:text-text-base
           

          "
                >
                    {loading ? (
                        Array.from({ length: skeletonLength }).map((_, index) => (
                            <tr key={index}>
                                {showCheckbox && (
                                    <td className="w-10">
                                        <Skeleton className="h-5 w-5 rounded" />
                                    </td>
                                )}

                                {columns.map((column) => (
                                    <td key={String(column.key)}>
                                        <Skeleton className="h-4 w-full rounded" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (showCheckbox ? 1 : 0)}
                                className="py-12 text-center
                                 text-text-secondary"
                            >
                                No data found.
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row.id}>
                                {showCheckbox && (
                                    <td className="w-10">
                                        <Checkbox className={checkboxClass} />
                                    </td>
                                )}

                                {columns.map((column) => (
                                    <td
                                        key={String(column.key)}
                                        className={`
                      max-w-60 truncate
                      ${column.cellClassName ?? ""}
                      ${column.align === "center"
                                                ? "text-center"
                                                : column.align === "right"
                                                    ? "text-right"
                                                    : "text-left"
                                            }
                    `}
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : String(row[column.key as keyof T] ?? "--")}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;