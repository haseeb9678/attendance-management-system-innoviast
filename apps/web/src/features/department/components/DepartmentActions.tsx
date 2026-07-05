import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Department } from "../types/department.types";

interface DepartmentActionsProps {
    department: Department;
    onView?: (department: Department) => void;
    onEdit?: (department: Department) => void;
    onDelete?: (department: Department) => void;
}

const buttonClass = `
    flex h-9 w-9 items-center justify-center
    rounded-lg
    border border-border
    bg-bg-card
    transition-all duration-200
    cursor-pointer
`;

const DepartmentActions = ({
    department,
    onView,
    onEdit,
    onDelete,
}: DepartmentActionsProps) => {
    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={() => onView?.(department)}
                className={`
                    ${buttonClass}
                    text-primary
                    hover:bg-primary/10
                    hover:border-primary/30
                `}
                aria-label="View department"
                title="View"
            >
                <Eye className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onEdit?.(department)}
                className={`
                    ${buttonClass}
                    text-warning
                    hover:bg-warning/10
                    hover:border-warning/30
                `}
                aria-label="Edit department"
                title="Edit"
            >
                <Pencil className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onDelete?.(department)}
                className={`
                    ${buttonClass}
                    text-error
                    hover:bg-error/10
                    hover:border-error/30
                `}
                aria-label="Delete department"
                title="Delete"
            >
                <Trash2 className="h-4.5 w-4.5" />
            </button>
        </div>
    );
};

export default DepartmentActions;