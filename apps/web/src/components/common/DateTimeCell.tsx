import { formatDate, formatTime } from "@/lib/date";

export interface DateTimeCellProps {
    date: Date;
}

const DateTimeCell = ({ date }: DateTimeCellProps) => (
    <div className="flex items-center gap-2">
        <span className=" text-text-base">
            {formatDate(date)}
        </span>

        <span className="text-xs text-text-secondary">
            {formatTime(date)}
        </span>
    </div>
);

export default DateTimeCell;

