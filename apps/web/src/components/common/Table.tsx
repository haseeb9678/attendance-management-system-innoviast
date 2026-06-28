import type { ReactNode } from "react";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";
import { Inbox } from "lucide-react";

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
        <div className="w-full overflow-x-auto table-scroll">
            <table className="w-full min-w-full text-sm border-collapse ">
                <thead className="
                    sticky top-0 z-2
                    border-y border-border bg-surface
                    text-text-secondary/80 uppercase
                    [&_th]:whitespace-nowrap
                    [&_th]:h-11
                    [&_th]:px-6
                    [&_th]:py-3
                    [&_th]:font-medium!
                    [&_th]:text-xs
                    [&_th]:tracking-wide
                ">
                    <tr>
                        {showCheckbox && (
                            <th className="w-12 px-4!">
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

                <tbody className={`
                    divide-y divide-border
                    [&_tr]:h-14
                    [&_tr]:min-h-14
                    ${!loading && "[&_tr:hover]:bg-surface/60 [&_tr]:transition-colors [&_tr]:duration-150"}
                    [&_td]:whitespace-nowrap
                    [&_td]:px-6
                    [&_td]:py-4
                    [&_td]:text-text-base
                    [&_td]:align-middle
                `}>
                    {loading ? (
                        Array.from({ length: skeletonLength }).map((_, index) => (
                            <tr key={index}>
                                {showCheckbox && (
                                    <td className="w-12 px-4!">
                                        <Skeleton className="h-4 w-4 rounded" />
                                    </td>
                                )}
                                {columns.map((column) => (
                                    <td key={String(column.key)}>
                                        <Skeleton className="h-4 w-3/4 rounded" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (showCheckbox ? 1 : 0)}
                                className="py-16 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-2 text-text-secondary">
                                    <Inbox className="h-8 w-8 opacity-40" />
                                    <span className="text-sm">No data found</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row.id}>
                                {showCheckbox && (
                                    <td className="w-12 px-4!">
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