import { formatDistanceToNowStrict } from "date-fns";

import { formatDate, formatTime } from "@/lib/date";

export interface LoginAtCellProps {
    date?: Date | string | null;
}

const LoginAtCell = ({
    date,
}: LoginAtCellProps) => {
    if (!date) {
        return (
            <span className="text-text-secondary italic">
                Never
            </span>
        );
    }

    const loginDate = new Date(date);

    return (
        <div className="flex flex-col leading-tight">
            <span className="font-medium text-text-base">
                {formatDistanceToNowStrict(loginDate, {
                    addSuffix: true,
                })}
            </span>

            <span className="text-xs text-text-secondary">
                {formatDate(loginDate)} • {formatTime(loginDate)}
            </span>
        </div>
    );
};

export default LoginAtCell;