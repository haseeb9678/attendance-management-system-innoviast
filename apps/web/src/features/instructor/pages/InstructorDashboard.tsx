import { useMemo } from "react";
import {
    BookOpen,
    CalendarCheck,
    CalendarClock,
    CheckCircle2,
    Clock3,
    GraduationCap,
    Users,
} from "lucide-react";

import DataTable, {
    type TableColumn,
} from "@/components/common/Table";

import { useInstructorDashboard } from "@/features/instructor/hooks/useInstructor";
import DateTimeCell from "@/components/common/DateTimeCell";

interface Session {
    _id: string;

    room: string;

    date: string;

    startTime: string;

    endTime: string;

    attendanceStatus: "completed" | "pending";

    subject: {
        _id: string;
        name: string;
        code: string;
    };

    class: {
        _id: string;
        name: string;
        code: string;
    };

    department: {
        _id: string;
        name: string;
        code: string;
    };
}

interface ClassSummary {
    class: {
        _id: string;
        name: string;
        code: string;
    };

    department: {
        _id: string;
        name: string;
        code: string;
    };

    subject: {
        _id: string;
        name: string;
        code: string;
    };

    totalStudents: number;

    totalSessions: number;

    completedSessions: number;

    pendingSessions: number;

    attendanceRate: number;
}

interface DashboardData {
    overview: {
        totalAssignments: number;
        totalClasses: number;
        totalSubjects: number;
        totalStudents: number;
        totalSessions: number;
        completedSessions: number;
        pendingSessions: number;
        attendanceRate: number;

        present: number;
        absent: number;
        late: number;
        excused: number;
    };

    attendance: {
        present: number;
        absent: number;
        late: number;
        excused: number;
    };

    recentSessions: Session[];

    upcomingSessions: Session[];

    classSummary: ClassSummary[];
}

interface DashboardCardProps {
    title: string;

    value: number | string;

    Icon: React.ElementType;

    color: string;
}

const DashboardCard = ({
    title,
    value,
    Icon,
    color,
}: DashboardCardProps) => {
    return (
        <div
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
                <div className="min-w-0">
                    <p
                        className="
                    text-text-secondary
                    text-sm
                    font-medium
                "
                    >
                        {title}
                    </p>

                    <h2
                        className="
                    mt-2
                    text-3xl
                    font-bold
                    text-text-base
                "
                    >
                        {value}
                    </h2>
                </div>

                <div
                    className={`
                h-14
                w-14
                rounded-2xl
                flex
                items-center
                justify-center
                shrink-0
                ${color}
            `}
                >
                    <Icon className="h-7 w-7" />
                </div>
            </div>
        </div>
    );
};

const InstructorDashboard = () => {

    const {
        data,
        isPending,
    } = useInstructorDashboard();

    const dashboard =
        data?.data as DashboardData | undefined;

    const recentSessionColumns =
        useMemo<TableColumn<Session>[]>(
            () => [
                {
                    key: "subject",

                    label: "Subject",

                    render: (row) =>
                        row.subject.name,
                },

                {
                    key: "class",

                    label: "Class",

                    render: (row) =>
                        row.class.name,
                },

                {
                    key: "room",

                    label: "Room",
                    render: (row) =>
                        row.room || "--",
                },

                {
                    key: "date",

                    label: "Date",
                    render: (row) =>
                    (<DateTimeCell
                        date={row.date}

                    />),
                },

                {
                    key: "attendanceStatus",

                    label: "Status",

                    render: (row) => (
                        <span
                            className={`
                                px-2
                                py-1

                                rounded-full

                                text-xs
                                font-medium

                                ${row.attendanceStatus ===
                                    "completed"
                                    ? "bg-success/15 text-success"
                                    : "bg-warning/15 text-warning"
                                }
                            `}
                        >
                            {row.attendanceStatus}
                        </span>
                    ),
                },
            ],
            []
        );

    const upcomingSessionColumns =
        recentSessionColumns;

    return (
        <div
            className="
                flex
                flex-col
                gap-6
                  flex-1 h-max min-w-0
            "
        >
            <section
                className="
                    bg-bg-card
                    border
                    border-border
                    rounded-md
                    shadow-sm
                    p-6
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >
                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-text-base
                            "
                        >
                            Instructor Dashboard
                        </h2>

                        <p
                            className="
                                text-text-secondary
                                mt-1
                            "
                        >
                            Overview of your teaching
                            activities.
                        </p>

                    </div>
                </div>

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-4

                        gap-5

                        mt-8
                    "
                >
                    <DashboardCard
                        title="Assignments (Assigned Courses)"
                        value={
                            dashboard?.overview
                                .totalAssignments ?? 0
                        }
                        Icon={BookOpen}
                        color="bg-primary/20 text-primary"
                    />

                    <DashboardCard
                        title="Classes"
                        value={
                            dashboard?.overview
                                .totalClasses ?? 0
                        }
                        Icon={GraduationCap}
                        color="bg-success/20 text-success"
                    />

                    <DashboardCard
                        title="Students"
                        value={
                            dashboard?.overview
                                .totalStudents ?? 0
                        }
                        Icon={Users}
                        color="bg-warning/20 text-warning"
                    />

                    <DashboardCard
                        title="Subjects"
                        value={
                            dashboard?.overview
                                .totalSubjects ?? 0
                        }
                        Icon={BookOpen}
                        color="bg-error/20 text-error"
                    />


                </div>
                <div className="mt-8 border-t border-dashed border-border" />

                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-text-base">
                        Attendance Overview
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                        Overall attendance statistics across all your sessions.
                    </p>

                    <div
                        className="
        mt-5
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-5
    "
                    >
                        <MiniStatCard
                            title="Present"
                            value={dashboard?.attendance.present ?? 0}
                            valueClassName="text-success"
                            className="bg-success/5 hover:border-success/30 hover:shadow-sm"
                        />

                        <MiniStatCard
                            title="Absent"
                            value={dashboard?.attendance.absent ?? 0}
                            valueClassName="text-error"
                            className="bg-error/5 hover:border-error/30 hover:shadow-sm"
                        />

                        <MiniStatCard
                            title="Late"
                            value={dashboard?.attendance.late ?? 0}
                            valueClassName="text-warning"
                            className="bg-warning/5 hover:border-warning/30 hover:shadow-sm"
                        />

                        <MiniStatCard
                            title="Excused"
                            value={dashboard?.attendance.excused ?? 0}
                            valueClassName="text-primary"
                            className="bg-primary/5 hover:border-primary/30 hover:shadow-sm"
                        />
                    </div>
                </div>

                <div className="mt-8 border-t border-dashed border-border" />

                <div className="mt-8">
                    <div className="mb-5">
                        <h3 className="text-xl font-semibold text-text-base">
                            Recent Sessions
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            Your latest teaching sessions.
                        </p>
                    </div>

                    <div className="min-h-70">
                        <DataTable
                            columns={recentSessionColumns}
                            data={
                                dashboard?.recentSessions
                            }
                            loading={isPending}
                            showCheckbox={false}
                        />
                    </div>
                </div>


            </section>
        </div>
    );
};

interface MiniStatCardProps {
    title: string;
    value: string | number;
    valueClassName?: string;
    className?: string;
    subtitle?: string;
}

const MiniStatCard = ({
    title,
    value,
    valueClassName = "text-text-base",
    className = "",
    subtitle,
}: MiniStatCardProps) => {
    return (
        <div
            className={`
                border border-border
                rounded-2xl
                bg-bg
                p-5
                transition-all
              
               
                ${className}
            `}
        >
            <p className="text-sm font-medium text-text-secondary">
                {title}
            </p>

            <h3
                className={`
                    mt-2
                    text-3xl
                    font-bold
                    ${valueClassName}
                `}
            >
                {value}
            </h3>

            {subtitle && (
                <p className="mt-2 text-xs text-text-muted">
                    {subtitle}
                </p>
            )}
        </div>
    );
};


export default InstructorDashboard;