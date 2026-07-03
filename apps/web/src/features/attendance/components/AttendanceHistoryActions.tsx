import { Eye } from "lucide-react";


import type { AttendanceHistory } from "../types/attendance.types";
import FormButton from "@/components/common/FormButton";

const AttendanceHistoryActions = ({
    attendance,
    onView,
}: {
    attendance: AttendanceHistory;

    onView: (
        attendance: AttendanceHistory
    ) => void;
}) => {
    const buttonClass =
        `
    flex h-9 w-9 items-center justify-center
    rounded-lg
    border border-border
    bg-bg-card
    transition-all duration-200
    cursor-pointer
    `;
    return (


        <div className="flex justify-end">
            <button
                type="button"
                onClick={() =>
                    onView(attendance)
                }
                className={`
                            ${buttonClass}
                            text-primary
                            hover:bg-primary/10
                            hover:border-primary/30
                        `}
                aria-label="View user"
                title="View"
            >
                <Eye className="h-4.5 w-4.5" />
            </button>
        </div>
    );
};

export default AttendanceHistoryActions;