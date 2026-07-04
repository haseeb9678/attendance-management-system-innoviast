import {
    CalendarRange,
    ClipboardCheck,
    Clock3,
    Users,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

interface AttendanceStatsProps {
    stats?: {
        totalSessions: number;
        scheduledSessions: number;
        ongoingSessions: number;
        completedSessions: number;
        cancelledSessions: number;

        markedSessions: number;
        pendingAttendanceSessions: number;

        totalMarked: number;
        present: number;
        absent: number;
        late: number;
        excused: number;

        attendanceMarkingRate: number;
        presentRate: number;
        absentRate: number;
        lateRate: number;
        excusedRate: number;
    };

    loading?: boolean;
}

const AttendanceStats = ({
    stats,
    loading = false,
}: AttendanceStatsProps) => {
    const cards = [
        {
            title: "Total Sessions",
            value: stats?.totalSessions ?? 0,
            helper: "All assigned sessions",
            Icon: CalendarRange,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            title: "Marked Sessions",
            value: stats?.markedSessions ?? 0,
            helper: `${stats?.attendanceMarkingRate ?? 0}% attendance marked`,
            Icon: ClipboardCheck,
            color: "text-success",
            bg: "bg-success/10",
        },
        {
            title: "Pending Attendance",
            value:
                stats?.pendingAttendanceSessions ??
                0,
            helper: "Sessions awaiting attendance",
            Icon: Clock3,
            color: "text-warning",
            bg: "bg-warning/10",
        },
        {
            title: "Attendance Records",
            value: stats?.totalMarked ?? 0,
            helper: "Total student attendance entries",
            Icon: Users,
            color: "text-primary/80",
            bg: "bg-primary/10",
        },
    ];

    return (
        <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-5
                p-6
                pb-0
            "
        >
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="
                        border border-border
                        rounded-2xl
                        bg-bg
                        p-5
                        transition-all
                        hover:border-primary/30
                        hover:shadow-sm
                    "
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2 min-w-0">
                            <p className="text-sm font-medium text-text-secondary">
                                {card.title}
                            </p>

                            {loading ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <h2
                                    className="
                                        text-3xl
                                        font-bold
                                        text-text-base
                                    "
                                >
                                    {card.value}
                                </h2>
                            )}

                            {loading ? (
                                <Skeleton className="h-4 w-32" />
                            ) : (
                                <p className="text-xs text-text-muted">
                                    {card.helper}
                                </p>
                            )}
                        </div>

                        <div
                            className={`
                                h-12
                                w-12
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                                shrink-0
                                ${card.bg}
                            `}
                        >
                            <card.Icon
                                size={22}
                                className={card.color}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceStats;