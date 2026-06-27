import { Clock3 } from "lucide-react";

import {
    formatSessionTime,
    getSessionDuration,
} from "@/lib/date";

interface SessionTimeCellProps {
    startTime: string;
    endTime: string;
}

const SessionTimeCell = ({
    startTime,
    endTime,
}: SessionTimeCellProps) => {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-text-base">
                <Clock3
                    size={14}
                    className="text-primary shrink-0"
                />

                <span className="font-medium">
                    {formatSessionTime(
                        startTime,
                        endTime
                    )}
                </span>
            </div>

            <div className="ml-6 text-xs text-text-muted">
                ⏱ {getSessionDuration(startTime, endTime)}
            </div>
        </div>
    );
};

export default SessionTimeCell;