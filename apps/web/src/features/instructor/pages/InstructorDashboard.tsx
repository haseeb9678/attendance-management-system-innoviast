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
                bg-surface/60
                backdrop-blur-md
                border border-border
                rounded-md
                p-5

                flex
                items-center
                justify-between
              
                shadow-sm
            "
        >
            <div>

                <p
                    className="
                        text-text-secondary
                        text-sm
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

                    rounded-xl

                    flex
                    items-center
                    justify-center

                    ${color}
                `}
            >
                <Icon
                    className="h-7 w-7 text-white"
                />
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
                        color="bg-primary"
                    />

                    <DashboardCard
                        title="Classes"
                        value={
                            dashboard?.overview
                                .totalClasses ?? 0
                        }
                        Icon={GraduationCap}
                        color="bg-success"
                    />

                    <DashboardCard
                        title="Students"
                        value={
                            dashboard?.overview
                                .totalStudents ?? 0
                        }
                        Icon={Users}
                        color="bg-warning"
                    />

                    <DashboardCard
                        title="Subjects"
                        value={
                            dashboard?.overview
                                .totalSubjects ?? 0
                        }
                        Icon={BookOpen}
                        color="bg-error"
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
                        <div
                            className="
                                border
                                border-border
                                rounded-md
                                p-5

                                bg-success/5
                            "
                        >
                            <p className="text-sm text-text-secondary">
                                Present
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-success">
                                {dashboard?.attendance.present ?? 0}
                            </h3>
                        </div>

                        <div
                            className="
                                border
                                border-border
                                rounded-md
                                p-5

                                bg-error/5
                            "
                        >
                            <p className="text-sm text-text-secondary">
                                Absent
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-error">
                                {dashboard?.attendance.absent ?? 0}
                            </h3>
                        </div>

                        <div
                            className="
                                border
                                border-border
                                rounded-md
                                p-5

                                bg-warning/5
                            "
                        >
                            <p className="text-sm text-text-secondary">
                                Late
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-warning">
                                {dashboard?.attendance.late ?? 0}
                            </h3>
                        </div>

                        <div
                            className="
                                border
                                border-border
                                rounded-md
                                p-5

                                bg-info/5
                            "
                        >
                            <p className="text-sm text-text-secondary">
                                Excused
                            </p>

                            <h3 className="mt-2 text-3xl font-bold text-text-secondary">
                                {dashboard?.attendance.excused ?? 0}
                            </h3>
                        </div>
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

                <div className="mt-8 border-t border-dashed border-border" />

                <div className="mt-8 hidden">
                    <div className="mb-5">
                        <h3 className="text-xl font-semibold text-text-base">
                            My Classes
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            Summary of classes currently assigned to you.
                        </p>
                    </div>

                    {dashboard?.classSummary.length ? (
                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-3
                                gap-5
                            "
                        >
                            {dashboard.classSummary.map(
                                (item) => (
                                    <div
                                        key={`${item.class._id}-${item.subject._id}`}
                                        className="
                                            bg-surface
                                            border border-border
                                            rounded-md
                                            p-5

                                            flex
                                            flex-col
                                            gap-5

                                            transition-all
                                            duration-200

                                            hover:border-primary/30
                                            hover:shadow-md
                                        "
                                    >
                                        <div>
                                            <h4
                                                className="
                                                    text-lg
                                                    font-semibold
                                                    text-text-base
                                                "
                                            >
                                                {item.class.name}
                                            </h4>

                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    text-text-secondary
                                                "
                                            >
                                                {item.department.name}
                                            </p>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                text-sm
                                            "
                                        >
                                            <span className="text-text-secondary">
                                                Subject
                                            </span>

                                            <span className="font-medium text-text-base">
                                                {item.subject.name}
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                grid
                                                grid-cols-2
                                                gap-4
                                            "
                                        >
                                            <div>
                                                <p className="text-xs text-text-secondary">
                                                    Students
                                                </p>

                                                <p className="mt-1 text-xl font-bold text-text-base">
                                                    {item.totalStudents}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-text-secondary">
                                                    Sessions
                                                </p>

                                                <p className="mt-1 text-xl font-bold text-text-base">
                                                    {item.totalSessions}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-text-secondary">
                                                    Completed
                                                </p>

                                                <p className="mt-1 font-semibold text-success">
                                                    {item.completedSessions}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-text-secondary">
                                                    Pending
                                                </p>

                                                <p className="mt-1 font-semibold text-warning">
                                                    {item.pendingSessions}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    mb-2
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-sm
                                                        text-text-secondary
                                                    "
                                                >
                                                    Attendance
                                                </span>

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-primary
                                                    "
                                                >
                                                    {item.attendanceRate}%
                                                </span>
                                            </div>

                                            <div
                                                className="
                                                    h-2
                                                    rounded-full
                                                    bg-border
                                                    overflow-hidden
                                                "
                                            >
                                                <div
                                                    className="
                                                        h-full
                                                        rounded-full
                                                        bg-primary
                                                        transition-all
                                                    "
                                                    style={{
                                                        width: `${item.attendanceRate}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div
                            className="
                                border
                                border-dashed
                                border-border
                                rounded-md
                                py-16

                                text-center
                                text-text-secondary
                            "
                        >
                            No classes assigned.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default InstructorDashboard;