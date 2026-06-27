import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Session } from "../types/session.types";

interface SessionActionsProps {
    session: Session;
    onView?: (session: Session) => void;
    onEdit?: (session: Session) => void;
    onDelete?: (session: Session) => void;
}

const buttonClass = `
    flex h-9 w-9 items-center justify-center
    rounded-lg
    border border-border
    bg-bg-card
    transition-all duration-200
    cursor-pointer
`;

const SessionActions = ({
    session,
    onView,
    onEdit,
    onDelete,
}: SessionActionsProps) => {
    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={() => onView?.(session)}
                className={`
                    ${buttonClass}
                    text-primary
                    hover:bg-primary/10
                    hover:border-primary/30
                `}
                aria-label="View session"
                title="View"
            >
                <Eye className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onEdit?.(session)}
                className={`
                    ${buttonClass}
                    text-warning
                    hover:bg-warning/10
                    hover:border-warning/30
                `}
                aria-label="Edit session"
                title="Edit"
            >
                <Pencil className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onDelete?.(session)}
                className={`
                    ${buttonClass}
                    text-error
                    hover:bg-error/10
                    hover:border-error/30
                `}
                aria-label="Delete session"
                title="Delete"
            >
                <Trash2 className="h-4.5 w-4.5" />
            </button>
        </div>
    );
};

export default SessionActions;