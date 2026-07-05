import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Subject } from "../types/subject.types";

interface SubjectActionsProps {
    subject: Subject;
    onView?: (subject: Subject) => void;
    onEdit?: (subject: Subject) => void;
    onDelete?: (subject: Subject) => void;
}

const buttonClass = `
    flex h-9 w-9 items-center justify-center
    rounded-lg
    border border-border
    bg-bg-card
    transition-all duration-200
    cursor-pointer
`;

const SubjectActions = ({
    subject,
    onView,
    onEdit,
    onDelete,
}: SubjectActionsProps) => {
    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={() => onView?.(subject)}
                className={`
                    ${buttonClass}
                    text-primary
                    hover:bg-primary/10
                    hover:border-primary/30
                `}
                aria-label="View subject"
                title="View"
            >
                <Eye className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onEdit?.(subject)}
                className={`
                    ${buttonClass}
                    text-warning
                    hover:bg-warning/10
                    hover:border-warning/30
                `}
                aria-label="Edit subject"
                title="Edit"
            >
                <Pencil className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onDelete?.(subject)}
                className={`
                    ${buttonClass}
                    text-error
                    hover:bg-error/10
                    hover:border-error/30
                `}
                aria-label="Delete subject"
                title="Delete"
            >
                <Trash2 className="h-4.5 w-4.5" />
            </button>
        </div>
    );
};

export default SubjectActions;