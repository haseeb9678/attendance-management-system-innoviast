import { Eye, Pencil, Trash2 } from "lucide-react";
import type { TeacherAssignment } from "../types/teacherAssignment.types";

interface TeacherAssignmentActionsProps {
    teacherAssignment: TeacherAssignment;
    onView?: (assignment: TeacherAssignment) => void;
    onEdit?: (assignment: TeacherAssignment) => void;
    onDelete?: (assignment: TeacherAssignment) => void;
}

const buttonClass = `
    flex h-9 w-9 items-center justify-center
    rounded-lg
    border border-border
    bg-bg-card
    transition-all duration-200
    cursor-pointer
`;

const TeacherAssignmentActions = ({
    teacherAssignment,
    onView,
    onEdit,
    onDelete,
}: TeacherAssignmentActionsProps) => {
    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                onClick={() => onView?.(teacherAssignment)}
                className={`
                    ${buttonClass}
                    text-primary
                    hover:bg-primary/10
                    hover:border-primary/30
                `}
                aria-label="View teacher assignment"
                title="View"
            >
                <Eye className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onEdit?.(teacherAssignment)}
                className={`
                    ${buttonClass}
                    text-warning
                    hover:bg-warning/10
                    hover:border-warning/30
                `}
                aria-label="Edit teacher assignment"
                title="Edit"
            >
                <Pencil className="h-4.5 w-4.5" />
            </button>

            <button
                type="button"
                onClick={() => onDelete?.(teacherAssignment)}
                className={`
                    ${buttonClass}
                    text-error
                    hover:bg-error/10
                    hover:border-error/30
                `}
                aria-label="Delete teacher assignment"
                title="Delete"
            >
                <Trash2 className="h-4.5 w-4.5" />
            </button>
        </div>
    );
};

export default TeacherAssignmentActions;