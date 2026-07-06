import { useMemo } from "react";
import {
    BookOpen,
    CalendarDays,
    CheckCircle2,
    GraduationCap,
    School,
    ShieldCheck,
    UserCog,
    Users,
} from "lucide-react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import DataTable, {
    type TableColumn,
} from "@/components/common/Table";
import DateTimeCell from "@/components/common/DateTimeCell";
import { useAdminDashboard } from "../hooks/useAdmin";

type Role = "student" | "instructor" | "admin";
type UserStatus = "active" | "inactive" | "suspended";

interface DashboardChartItem {
    name: string;
    value: number;
}

interface MonthlyAttendanceTrendItem {
    month: string;
    present: number;
    absent: number;
    late: number;
    excused: number;
}

interface RecentUser {
    _id: string;
    email: string;
    role: Role;
    status: UserStatus;
    createdAt: string;
}

interface RecentSession {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    status: "scheduled" | "ongoing" | "completed" | "cancelled";
    createdAt: string;

    teacherAssignment: {
        _id: string;
        instructor?: {
            _id: string;
            email: string;
        };
        class?: {
            _id: string;
            name: string;
        };
        subject?: {
            _id: string;
            name: string;
            code?: string;
        };
    };
}

interface RecentTeacherAssignment {
    _id: string;
    status: string;
    createdAt: string;
    instructor?: {
        _id: string;
        email: string;
    };
    class?: {
        _id: string;
        name: string;
    };
    subject?: {
        _id: string;
        name: string;
        code?: string;
    };
}

interface AdminDashboardData {
    overview: {
        totalUsers: number;
        totalStudents: number;
        totalInstructors: number;
        totalAdmins: number;
        totalDepartments: number;
        totalClasses: number;
        totalSubjects: number;
        totalTeacherAssignments: number;
    };

    sessions: {
        totalSessions: number;
        scheduledSessions: number;
        ongoingSessions: number;
        completedSessions: number;
        cancelledSessions: number;
    };

    attendance: {
        totalAttendanceRecords: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        presentRate: number;
        absentRate: number;
        lateRate: number;
        excusedRate: number;
    };

    charts: {
        attendanceDistribution: DashboardChartItem[];
        sessionStatusDistribution: DashboardChartItem[];
        userRoleDistribution: DashboardChartItem[];
        monthlyAttendanceTrend: MonthlyAttendanceTrendItem[];
    };

    recent: {
        users: RecentUser[];
        sessions: RecentSession[];
        teacherAssignments: RecentTeacherAssignment[];
    };
}

interface DashboardCardProps {
    title: string;
    value: number | string;
    Icon: React.ElementType;
    color: string;
}

interface MiniStatCardProps {
    title: string;
    value: string | number;
    valueClassName?: string;
    className?: string;
    subtitle?: string;
}

interface ChartCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const PIE_COLORS = [
    "var(--color-success)",
    "var(--color-error)",
    "var(--color-warning)",
    "var(--color-primary)",
];

const BAR_COLORS = [
    "var(--color-primary)",
    "var(--color-warning)",
    "var(--color-success)",
    "var(--color-error)",
];

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
                    <p className="text-sm font-medium text-text-secondary">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-text-base">
                        {value}
                    </h2>
                </div>

                <div
                    className={`
                        h-14 w-14 shrink-0 rounded-2xl
                        flex items-center justify-center
                        ${color}
                    `}
                >
                    <Icon className="h-7 w-7" />
                </div>
            </div>
        </div>
    );
};

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

const ChartCard = ({
    title,
    description,
    children,
}: ChartCardProps) => {
    return (
        <div
            className="
                rounded-2xl
                border border-border
                bg-bg-card
                p-5
                shadow-sm
            "
        >
            <div className="mb-5">
                <h3 className="text-lg font-semibold text-text-base">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                    {description}
                </p>
            </div>

            <div className="h-[320px]">{children}</div>
        </div>
    );
};

const renderRoleBadge = (role: Role) => {
    const styles: Record<Role, string> = {
        student: "bg-primary/15 text-primary",
        instructor: "bg-success/15 text-success",
        admin: "bg-warning/15 text-warning",
    };

    return (
        <span
            className={`
                rounded-full px-2 py-1
                text-xs font-medium capitalize
                ${styles[role]}
            `}
        >
            {role}
        </span>
    );
};

const renderStatusBadge = (
    status: string
) => {
    const normalized = status.toLowerCase();

    let classes =
        "bg-muted text-text-secondary";

    if (
        normalized === "active" ||
        normalized === "completed"
    ) {
        classes =
            "bg-success/15 text-success";
    } else if (
        normalized === "pending" ||
        normalized === "scheduled" ||
        normalized === "ongoing"
    ) {
        classes =
            "bg-warning/15 text-warning";
    } else if (
        normalized === "cancelled" ||
        normalized === "inactive" ||
        normalized === "suspended"
    ) {
        classes =
            "bg-error/15 text-error";
    }

    return (
        <span
            className={`
                rounded-full px-2 py-1
                text-xs font-medium capitalize
                ${classes}
            `}
        >
            {status}
        </span>
    );
};

const AdminDashboard = () => {
    const { data, isPending } =
        useAdminDashboard();

    const dashboard =
        data?.data as
        | AdminDashboardData
        | undefined;

    const recentUsersColumns =
        useMemo<TableColumn<RecentUser>[]>(
            () => [
                {
                    key: "email",
                    label: "Email",
                    render: (row) =>
                        row.email,
                },
                {
                    key: "role",
                    label: "Role",
                    render: (row) =>
                        renderRoleBadge(
                            row.role
                        ),
                },
                {
                    key: "status",
                    label: "Status",
                    render: (row) =>
                        renderStatusBadge(
                            row.status
                        ),
                },
                {
                    key: "createdAt",
                    label: "Joined",
                    render: (row) => (
                        <DateTimeCell
                            date={
                                row.createdAt
                            }
                        />
                    ),
                },
            ],
            []
        );

    const recentSessionsColumns =
        useMemo<TableColumn<RecentSession>[]>(
            () => [
                {
                    key: "subject",
                    label: "Subject",
                    render: (row) =>
                        row
                            .teacherAssignment
                            ?.subject
                            ?.name || "--",
                },
                {
                    key: "class",
                    label: "Class",
                    render: (row) =>
                        row
                            .teacherAssignment
                            ?.class?.name ||
                        "--",
                },
                {
                    key: "instructor",
                    label: "Instructor",
                    render: (row) =>
                        row
                            .teacherAssignment
                            ?.instructor
                            ?.email || "--",
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
                    render: (row) => (
                        <DateTimeCell
                            date={row.date}
                        />
                    ),
                },
                {
                    key: "status",
                    label: "Status",
                    render: (row) =>
                        renderStatusBadge(
                            row.status
                        ),
                },
            ],
            []
        );

    const recentAssignmentsColumns =
        useMemo<
            TableColumn<RecentTeacherAssignment>[]
        >(
            () => [
                {
                    key: "subject",
                    label: "Subject",
                    render: (row) =>
                        row.subject?.name ||
                        "--",
                },
                {
                    key: "class",
                    label: "Class",
                    render: (row) =>
                        row.class?.name ||
                        "--",
                },
                {
                    key: "instructor",
                    label: "Instructor",
                    render: (row) =>
                        row.instructor
                            ?.email || "--",
                },
                {
                    key: "status",
                    label: "Status",
                    render: (row) =>
                        renderStatusBadge(
                            row.status
                        ),
                },
                {
                    key: "createdAt",
                    label: "Assigned At",
                    render: (row) => (
                        <DateTimeCell
                            date={
                                row.createdAt
                            }
                        />
                    ),
                },
            ],
            []
        );

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-6">
            <section
                className="
                    rounded-md border border-border
                    bg-bg-card p-6 shadow-sm
                "
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-text-base">
                            Admin Dashboard
                        </h2>

                        <p className="mt-1 text-text-secondary">
                            Overview of users, attendance,
                            sessions, and academic activity.
                        </p>
                    </div>
                </div>

                {/* Overview Cards */}
                <div
                    className="
                        mt-8
                        grid grid-cols-1 gap-5
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >
                    <DashboardCard
                        title="Total Users"
                        value={
                            dashboard?.overview
                                .totalUsers ??
                            0
                        }
                        Icon={Users}
                        color="bg-primary/20 text-primary"
                    />

                    <DashboardCard
                        title="Students"
                        value={
                            dashboard?.overview
                                .totalStudents ??
                            0
                        }
                        Icon={GraduationCap}
                        color="bg-success/20 text-success"
                    />

                    <DashboardCard
                        title="Instructors"
                        value={
                            dashboard?.overview
                                .totalInstructors ??
                            0
                        }
                        Icon={UserCog}
                        color="bg-warning/20 text-warning"
                    />

                    <DashboardCard
                        title="Admins"
                        value={
                            dashboard?.overview
                                .totalAdmins ??
                            0
                        }
                        Icon={ShieldCheck}
                        color="bg-error/20 text-error"
                    />

                    <DashboardCard
                        title="Departments"
                        value={
                            dashboard?.overview
                                .totalDepartments ??
                            0
                        }
                        Icon={School}
                        color="bg-primary/20 text-primary"
                    />

                    <DashboardCard
                        title="Classes"
                        value={
                            dashboard?.overview
                                .totalClasses ??
                            0
                        }
                        Icon={GraduationCap}
                        color="bg-success/20 text-success"
                    />

                    <DashboardCard
                        title="Subjects"
                        value={
                            dashboard?.overview
                                .totalSubjects ??
                            0
                        }
                        Icon={BookOpen}
                        color="bg-warning/20 text-warning"
                    />

                    <DashboardCard
                        title="Assignments"
                        value={
                            dashboard?.overview
                                .totalTeacherAssignments ??
                            0
                        }
                        Icon={CalendarDays}
                        color="bg-error/20 text-error"
                    />
                </div>

                <div className="mt-8 border-t border-dashed border-border" />

                {/* Attendance Mini Stats */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-text-base">
                        Attendance Overview
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                        Overall attendance performance
                        across the whole system.
                    </p>

                    <div
                        className="
                            mt-5
                            grid grid-cols-2 gap-5
                            lg:grid-cols-4
                        "
                    >
                        <MiniStatCard
                            title="Present"
                            value={
                                dashboard
                                    ?.attendance
                                    .present ??
                                0
                            }
                            subtitle={`${dashboard?.attendance.presentRate ?? 0}% of attendance records`}
                            valueClassName="text-success"
                            className="bg-success/5 hover:border-success/30 hover:shadow-sm"
                        />

                        <MiniStatCard
                            title="Absent"
                            value={
                                dashboard
                                    ?.attendance
                                    .absent ??
                                0
                            }
                            subtitle={`${dashboard?.attendance.absentRate ?? 0}% of attendance records`}
                            valueClassName="text-error"
                            className="bg-error/5 hover:border-error/30 hover:shadow-sm"
                        />

                        <MiniStatCard
                            title="Late"
                            value={
                                dashboard
                                    ?.attendance
                                    .late ??
                                0
                            }
                            subtitle={`${dashboard?.attendance.lateRate ?? 0}% of attendance records`}
                            valueClassName="text-warning"
                            className="bg-warning/5 hover:border-warning/30 hover:shadow-sm"
                        />

                        <MiniStatCard
                            title="Excused"
                            value={
                                dashboard
                                    ?.attendance
                                    .excused ??
                                0
                            }
                            subtitle={`${dashboard?.attendance.excusedRate ?? 0}% of attendance records`}
                            valueClassName="text-primary"
                            className="bg-primary/5 hover:border-primary/30 hover:shadow-sm"
                        />
                    </div>
                </div>

                <div className="mt-8 border-t border-dashed border-border" />

                {/* Charts */}
                <div className="mt-8">
                    <div className="mb-5">
                        <h3 className="text-xl font-semibold text-text-base">
                            Analytics & Insights
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            Visual overview of attendance,
                            sessions, roles, and trends.
                        </p>
                    </div>

                    <div
                        className="
                            grid grid-cols-1 gap-6
                            2xl:grid-cols-2
                        "
                    >
                        {/* Attendance Distribution */}
                        <ChartCard
                            title="Attendance Distribution"
                            description="Breakdown of present, absent, late, and excused attendance records."
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={
                                            dashboard
                                                ?.charts
                                                .attendanceDistribution ??
                                            []
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={
                                            70
                                        }
                                        outerRadius={
                                            110
                                        }
                                        paddingAngle={
                                            3
                                        }
                                    >
                                        {(
                                            dashboard
                                                ?.charts
                                                .attendanceDistribution ??
                                            []
                                        ).map(
                                            (
                                                _entry,
                                                index
                                            ) => (
                                                <Cell
                                                    key={`attendance-cell-${index}`}
                                                    fill={
                                                        PIE_COLORS[
                                                        index %
                                                        PIE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        {/* Session Status */}
                        <ChartCard
                            title="Session Status"
                            description="Current distribution of scheduled, ongoing, completed, and cancelled sessions."
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={
                                        dashboard
                                            ?.charts
                                            .sessionStatusDistribution ??
                                        []
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={
                                            false
                                        }
                                        opacity={
                                            0.2
                                        }
                                    />

                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />

                                    <Bar
                                        dataKey="value"
                                        radius={[
                                            10,
                                            10,
                                            0,
                                            0,
                                        ]}
                                    >
                                        {(
                                            dashboard
                                                ?.charts
                                                .sessionStatusDistribution ??
                                            []
                                        ).map(
                                            (
                                                _entry,
                                                index
                                            ) => (
                                                <Cell
                                                    key={`session-bar-${index}`}
                                                    fill={
                                                        BAR_COLORS[
                                                        index %
                                                        BAR_COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        {/* User Role Distribution */}
                        <ChartCard
                            title="User Role Distribution"
                            description="Comparison of students, instructors, and admins in the system."
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={
                                        dashboard
                                            ?.charts
                                            .userRoleDistribution ??
                                        []
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={
                                            false
                                        }
                                        opacity={
                                            0.2
                                        }
                                    />

                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />

                                    <Bar
                                        dataKey="value"
                                        radius={[
                                            10,
                                            10,
                                            0,
                                            0,
                                        ]}
                                    >
                                        {(
                                            dashboard
                                                ?.charts
                                                .userRoleDistribution ??
                                            []
                                        ).map(
                                            (
                                                _entry,
                                                index
                                            ) => (
                                                <Cell
                                                    key={`role-bar-${index}`}
                                                    fill={
                                                        BAR_COLORS[
                                                        index %
                                                        BAR_COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        {/* Monthly Attendance Trend */}
                        <ChartCard
                            title="Monthly Attendance Trend"
                            description="Monthly trend of present, absent, late, and excused attendance."
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart
                                    data={
                                        dashboard
                                            ?.charts
                                            .monthlyAttendanceTrend ??
                                        []
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={
                                            false
                                        }
                                        opacity={
                                            0.2
                                        }
                                    />

                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="present"
                                        stroke="var(--color-success)"
                                        strokeWidth={
                                            3
                                        }
                                        dot={{
                                            r: 4,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="absent"
                                        stroke="var(--color-error)"
                                        strokeWidth={
                                            3
                                        }
                                        dot={{
                                            r: 4,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="late"
                                        stroke="var(--color-warning)"
                                        strokeWidth={
                                            3
                                        }
                                        dot={{
                                            r: 4,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="excused"
                                        stroke="var(--color-primary)"
                                        strokeWidth={
                                            3
                                        }
                                        dot={{
                                            r: 4,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </div>

                <div className="mt-8 border-t border-dashed border-border" />

                {/* Recent Users */}
                <div className="mt-8">
                    <div className="mb-5">
                        <h3 className="text-xl font-semibold text-text-base">
                            Recent Users
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            Latest users added to the
                            system.
                        </p>
                    </div>

                    <div className="min-h-70">
                        <DataTable
                            columns={
                                recentUsersColumns
                            }
                            data={
                                dashboard?.recent
                                    .users ?? []
                            }
                            loading={isPending}
                            showCheckbox={
                                false
                            }
                        />
                    </div>
                </div>

                <div className="mt-8 border-t border-dashed border-border" />

                {/* Recent Sessions */}
                <div className="mt-8">
                    <div className="mb-5">
                        <h3 className="text-xl font-semibold text-text-base">
                            Recent Sessions
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            Latest academic sessions
                            created in the system.
                        </p>
                    </div>

                    <div className="min-h-70">
                        <DataTable
                            columns={
                                recentSessionsColumns
                            }
                            data={
                                dashboard?.recent
                                    .sessions ?? []
                            }
                            loading={isPending}
                            showCheckbox={
                                false
                            }
                        />
                    </div>
                </div>

                <div className="mt-8 border-t border-dashed border-border" />

                {/* Recent Teacher Assignments */}
                <div className="mt-8">
                    <div className="mb-5">
                        <h3 className="text-xl font-semibold text-text-base">
                            Recent Teacher Assignments
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            Latest instructor-subject-class
                            assignments.
                        </p>
                    </div>

                    <div className="min-h-70">
                        <DataTable
                            columns={
                                recentAssignmentsColumns
                            }
                            data={
                                dashboard?.recent
                                    .teacherAssignments ??
                                []
                            }
                            loading={isPending}
                            showCheckbox={
                                false
                            }
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;