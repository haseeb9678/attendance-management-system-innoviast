import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Class } from "../types/class.types";

interface ClassActionsProps {
    classItem: Class;
    onView?: (classItem: Class) => void;
    onEdit?: (classItem: Class) => void;
    onDelete?: (classItem: Class) => void;
}

const buttonClass = `
    flex h-9 w-9 items-center justify-center
    rounded-lg
    border border-border
    bg-bg-card
    transition-all duration-200
    cursor-pointer
`;

const ClassActions = ({
    classItem,
    onView,
    onEdit,
    onDelete,
}: ClassActionsProps) => {
    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={() => onView?.(classItem)}
                className={`
                    ${buttonClass}
                    text-primary
                    hover:bg-primary/10
                    hover:border-primary/30
                `}
                aria-label="View class"
                title="View"
            >
                <Eye className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onEdit?.(classItem)}
                className={`
                    ${buttonClass}
                    text-warning
                    hover:bg-warning/10
                    hover:border-warning/30
                `}
                aria-label="Edit class"
                title="Edit"
            >
                <Pencil className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onDelete?.(classItem)}
                className={`
                    ${buttonClass}
                    text-error
                    hover:bg-error/10
                    hover:border-error/30
                `}
                aria-label="Delete class"
                title="Delete"
            >
                <Trash2 className="h-4.5 w-4.5" />
            </button>
        </div>
    );
};

export default ClassActions;