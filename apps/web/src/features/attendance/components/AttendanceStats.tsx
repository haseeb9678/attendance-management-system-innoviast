import {
    CalendarRange,
    CheckCircle2,
    Clock3,
    Users,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

interface AttendanceStatsProps {
    stats?: {
        totalSessions: number;
        completedSessions: number;
        pendingSessions: number;
        totalMarked: number;

        present: number;
        absent: number;
        late: number;
        excused: number;
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
            Icon: CalendarRange,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            title: "Completed",
            value: stats?.completedSessions ?? 0,
            Icon: CheckCircle2,
            color: "text-success",
            bg: "bg-success/10",
        },
        {
            title: "Pending",
            value: stats?.pendingSessions ?? 0,
            Icon: Clock3,
            color: "text-warning",
            bg: "bg-warning/10",
        },
        {
            title: "Attendance Marked",
            value: stats?.totalMarked ?? 0,
            Icon: Users,
            color: "text-primary/70",
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
                        rounded-xl
                        bg-bg
                        p-5
                        transition-all
                        hover:border-primary/30
                        hover:shadow-sm
                    "
                >
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-text-secondary">
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
                        </div>

                        <div
                            className={`
                                h-12
                                w-12
                                rounded-xl
                                flex
                                items-center
                                justify-center
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