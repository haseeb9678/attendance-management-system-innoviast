import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    CheckCircle2,
    CircleOff,
    Clock3,
    FileText,
    ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Bar,
    BarChart,
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

import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import Combobox from "@/components/common/Combobox";
import EntriesSelect from "@/components/common/EnteriesSelect";
import Pagination from "@/components/common/Pagination";
import DataTable, {
    type TableColumn,
} from "@/components/common/Table";
import ExportButton from "@/components/common/ExportButton";
import DateTimeCell from "@/components/common/DateTimeCell";

import { SEO } from "@/shared/components/SEO";
import useDebounce from "@/shared/hooks/useDebounce";
import { limitOptions } from "@/shared/constants/filters";

import {
    useAdminAttendanceHistory,
    useAdminAttendanceHistoryStats,
} from "../hooks/useAdmin";
import { useClassOptions } from "@/features/class/hooks/useClassOptions";
import { useSubjectOptions } from "@/features/subject/hooks/useSubjectOptions";
import { adminAttendanceHistoryExportColumns } from "../constants/attendanceHistoryExportColumns";

type AttendanceDistributionItem = {
    name: string;
    value: number;
};

type AttendanceTrendItem = {
    date: string;
    attendanceRate: number;
};

type ClassWiseAttendanceItem = {
    classId: string;
    className: string;
    attendanceRate: number;
};

type AttendanceSummary = {
    totalSessions: number;
    totalAttendanceRecords: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    averageAttendanceRate: number;
};

type AttendanceSessionRow = {
    _id: string;
    status: string;
    sessionDate?: string;
    createdAt?: string;
    startTime?: string;
    endTime?: string;

    subject?: {
        _id: string;
        name: string;
        code?: string;
    };

    class?: {
        _id: string;
        name: string;
        section?: string;
        semester?: number;
    };

    department?: {
        _id: string;
        name: string;
    };

    instructor?: {
        _id: string;
        fullName?: string;
        email?: string;
    };

    attendanceSummary: {
        totalStudents: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendanceRate: number;
    };
};

type AdminAttendanceHistoryStatsResponse = {
    summary: AttendanceSummary;
    charts: {
        attendanceDistribution: AttendanceDistributionItem[];
        attendanceTrend: AttendanceTrendItem[];
        classWiseAttendance: ClassWiseAttendanceItem[];
    };
};

type AdminAttendanceHistoryTableResponse = {
    sessions: AttendanceSessionRow[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

type Option = {
    label: string;
    value: string | undefined;
};

const attendanceStatusOptions: Option[] = [
    { label: "All", value: undefined },
    { label: "Completed", value: "completed" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Cancelled", value: "cancelled" },
];

const adminAttendanceSortOptions: Option[] = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    {
        label: "Highest Attendance",
        value: "highest_attendance",
    },
    {
        label: "Lowest Attendance",
        value: "lowest_attendance",
    },
];

const PIE_COLORS = [
    "var(--color-success)",
    "var(--color-error)",
    "var(--color-warning)",
    "var(--color-primary)",
];

const BAR_COLORS = [
    "var(--color-primary)",
    "var(--color-success)",
    "var(--color-warning)",
    "var(--color-error)",
];

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    valueClassName?: string;
    iconClassName?: string;
}

const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    valueClassName = "text-text-base",
    iconClassName = "bg-primary/15 text-primary",
}: StatCardProps) => {
    return (
        <div
            className="
                rounded-2xl border border-border
                bg-bg p-5 shadow-sm
                transition-all hover:border-primary/25
            "
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-text-secondary">
                        {title}
                    </p>

                    <h3
                        className={`mt-2 text-3xl font-bold ${valueClassName}`}
                    >
                        {value}
                    </h3>

                    {subtitle && (
                        <p className="mt-2 text-xs text-text-muted">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div
                    className={`
                        h-12 w-12 shrink-0 rounded-2xl
                        flex items-center justify-center
                        ${iconClassName}
                    `}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

interface ChartCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const ChartCard = ({
    title,
    description,
    children,
}: ChartCardProps) => {
    return (
        <div
            className="
                rounded-2xl border border-border
                bg-bg p-5 shadow-sm
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

const renderSessionStatusBadge = (status?: string) => {
    const normalized = status?.toLowerCase() || "";

    let classes = "bg-muted text-text-secondary";

    if (normalized === "completed") {
        classes = "bg-success/15 text-success";
    } else if (
        normalized === "scheduled" ||
        normalized === "ongoing"
    ) {
        classes = "bg-warning/15 text-warning";
    } else if (normalized === "cancelled") {
        classes = "bg-error/15 text-error";
    }

    return (
        <span
            className={`
                rounded-full px-2 py-1
                text-xs font-medium capitalize
                ${classes}
            `}
        >
            {status || "--"}
        </span>
    );
};



const AttendanceHistory = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitOptions[0]);

    const [status, setStatus] = useState<Option>(
        attendanceStatusOptions[0]
    );

    const [sort, setSort] = useState<Option>(
        adminAttendanceSortOptions[0]
    );

    const [selectedClass, setSelectedClass] =
        useState<Option | null>();

    const [selectedSubject, setSelectedSubject] =
        useState<Option | null>();

    const [selectedRowIds, setSelectedRowIds] = useState<
        string[]
    >([]);

    const debouncedSearch = useDebounce(search, 500);

    /**
     * Filter options
     */
    const { options: classOptions } = useClassOptions();
    const { options: subjectOptions } = useSubjectOptions();

    const allClassOptions = useMemo(
        () => [
            {
                label: "All Classes",
                value: "",
            },
            ...(classOptions ?? []),
        ],
        [classOptions]
    );

    const allSubjectOptions = useMemo(
        () => [
            {
                label: "All Subjects",
                value: "",
            },
            ...(subjectOptions ?? []),
        ],
        [subjectOptions]
    );

    useEffect(() => {
        if (!selectedClass) {
            setSelectedClass(allClassOptions[0]);
        }

        if (!selectedSubject) {
            setSelectedSubject(allSubjectOptions[0]);
        }
    }, [
        allClassOptions,
        allSubjectOptions,
        selectedClass,
        selectedSubject,
    ]);

    /**
     * Fixed stats + charts query
     */
    const {
        data: statsData,
        isPending: isStatsLoading,
    } = useAdminAttendanceHistoryStats();

    /**
     * Paginated/filterable table query
     */
    const {
        data: historyData,
        isPending: isTableLoading,
    } = useAdminAttendanceHistory({
        page,
        limit: limit.value,
        search: debouncedSearch || undefined,
        classId:
            selectedClass?.value || undefined,
        subjectId:
            selectedSubject?.value || undefined,
        status: status.value || undefined,
        sortBy: sort.value as
            | "newest"
            | "oldest"
            | "highest_attendance"
            | "lowest_attendance",
    });

    const stats =
        statsData?.data as
        | AdminAttendanceHistoryStatsResponse
        | undefined;

    const attendanceHistory =
        historyData?.data as
        | AdminAttendanceHistoryTableResponse
        | undefined;

    /**
     * Reset page when filters change
     */
    useEffect(() => {
        setPage(1);
    }, [
        debouncedSearch,
        status,
        sort,
        limit,
        selectedClass,
        selectedSubject,
    ]);

    /**
     * Actions
     */
    const handleView = (
        row: AttendanceSessionRow
    ) => {
        navigate(
            `${row._id}`
        );
    };

    /**
     * Table columns
     */
    const columns = useMemo<
        TableColumn<AttendanceSessionRow>[]
    >(
        () => [
            {
                key: "subject",
                label: "Subject",
                render: (row) => (
                    <div className="min-w-0">
                        <p className="font-medium text-text-base">
                            {row.subject?.name || "--"}
                        </p>
                        <p className="text-xs text-text-secondary">
                            {row.subject?.code || "--"}
                        </p>
                    </div>
                ),
            },
            {
                key: "class",
                label: "Class",
                render: (row) => (
                    <div className="min-w-0">
                        <p className="font-medium text-text-base">
                            {row.class?.name || "--"}
                            {row.class?.section
                                ? ` (${row.class.section})`
                                : ""}
                        </p>
                        <p className="text-xs text-text-secondary">
                            {row.class?.semester
                                ? `Semester ${row.class.semester}`
                                : "--"}
                        </p>
                    </div>
                ),
            },
            {
                key: "department",
                label: "Department",
                render: (row) =>
                    row.department?.name || "--",
            },
            {
                key: "instructor",
                label: "Instructor",
                render: (row) => (
                    <div className="min-w-0">
                        <p className="font-medium text-text-base">
                            {row.instructor?.fullName ||
                                "--"}
                        </p>
                        <p className="text-xs text-text-secondary">
                            {row.instructor?.email ||
                                "--"}
                        </p>
                    </div>
                ),
            },
            {
                key: "sessionDate",
                label: "Session Date",
                render: (row) => (
                    <DateTimeCell
                        date={
                            row.sessionDate ||
                            row.createdAt ||
                            ""
                        }
                    />
                ),
            },
            {
                key: "present",
                label: "Present",
                render: (row) => (
                    <span className="font-medium text-success">
                        {row.attendanceSummary?.present ??
                            0}
                    </span>
                ),
            },
            {
                key: "absent",
                label: "Absent",
                render: (row) => (
                    <span className="font-medium text-error">
                        {row.attendanceSummary?.absent ??
                            0}
                    </span>
                ),
            },
            {
                key: "late",
                label: "Late",
                render: (row) => (
                    <span className="font-medium text-warning">
                        {row.attendanceSummary?.late ??
                            0}
                    </span>
                ),
            },
            {
                key: "excused",
                label: "Excused",
                render: (row) => (
                    <span className="font-medium text-primary">
                        {row.attendanceSummary?.excused ??
                            0}
                    </span>
                ),
            },
            {
                key: "attendanceRate",
                label: "Attendance %",
                render: (row) => (
                    <span className="font-semibold text-text-base">
                        {row.attendanceSummary
                            ?.attendanceRate ?? 0}
                        %
                    </span>
                ),
            },
            {
                key: "status",
                label: "Status",
                render: (row) =>
                    renderSessionStatusBadge(
                        row.status
                    ),
            },
            {
                key: "actions",
                label: "Actions",
                render: (row) => (
                    <button
                        type="button"
                        onClick={() =>
                            handleView(row)
                        }
                        className="
                            rounded-md border border-border
                            px-3 py-1.5 text-sm font-medium
                            text-primary transition-colors
                            hover:bg-primary/10
                        "
                    >
                        View
                    </button>
                ),
            },
        ],
        []
    );

    return (
        <>
            <SEO
                title="Admin Attendance History | Attendix"
                description="Review attendance records, session summaries, and attendance insights across the system."
                noindex
            />

            <section
                className="
                    bg-bg-card
                    border border-border
                    rounded-md
                    shadow-sm
                    flex flex-col
                    gap-3
                    flex-1
                    min-w-0
                    h-max
                "
            >
                {/* Header */}
                <div
                    className="
                        p-6
                        flex flex-col
                        md:flex-row
                        justify-between
                        gap-5
                    "
                >
                    <div>
                        <h2
                            className="
                                text-2xl font-bold text-text-base
                            "
                        >
                            Attendance Report
                        </h2>

                        <p
                            className="
                                text-sm text-text-secondary mt-1
                            "
                        >
                            Review all conducted sessions,
                            attendance summaries, and
                            attendance performance across
                            the system.
                        </p>
                    </div>

                    <ExportButton
                        data={
                            attendanceHistory?.sessions ??
                            []
                        }
                        selectedRowIds={selectedRowIds}
                        getRowId={(row) => row._id}
                        fileName="admin-attendance-history"
                        columns={
                            adminAttendanceHistoryExportColumns
                        }
                        className="w-max"
                    />
                </div>

                <div className="border-t border-dashed border-border" />

                {/* Summary Cards */}
                <div className="px-6 pt-6">
                    <div
                        className="
                            grid grid-cols-1 gap-5
                            sm:grid-cols-2
                            xl:grid-cols-3
                            2xl:grid-cols-6
                        "
                    >
                        <StatCard
                            title="Total Sessions"
                            value={
                                stats?.summary
                                    ?.totalSessions ?? 0
                            }
                            subtitle="Overall conducted session records"
                            icon={FileText}
                            iconClassName="bg-primary/15 text-primary"
                        />

                        <StatCard
                            title="Attendance Records"
                            value={
                                stats?.summary
                                    ?.totalAttendanceRecords ??
                                0
                            }
                            subtitle="Total student attendance rows"
                            icon={BarChart3}
                            iconClassName="bg-pink-600/15 text-pink-700"
                        />

                        <StatCard
                            title="Present"
                            value={
                                stats?.summary?.present ??
                                0
                            }
                            subtitle="Students marked present"
                            icon={CheckCircle2}
                            valueClassName="text-success"
                            iconClassName="bg-success/15 text-success"
                        />

                        <StatCard
                            title="Absent"
                            value={
                                stats?.summary?.absent ??
                                0
                            }
                            subtitle="Students marked absent"
                            icon={CircleOff}
                            valueClassName="text-error"
                            iconClassName="bg-error/15 text-error"
                        />

                        <StatCard
                            title="Late"
                            value={
                                stats?.summary?.late ?? 0
                            }
                            subtitle="Students marked late"
                            icon={Clock3}
                            valueClassName="text-warning"
                            iconClassName="bg-warning/15 text-warning"
                        />

                        <StatCard
                            title="Avg Attendance"
                            value={`${stats?.summary?.averageAttendanceRate ?? 0}%`}
                            subtitle="Average attendance across all sessions"
                            icon={ShieldAlert}
                            iconClassName="bg-primary/15 text-primary"
                        />
                    </div>
                </div>

                <div className="px-6">
                    <div className="mt-6 border-t border-dashed border-border" />
                </div>

                {/* Charts */}
                <div className="px-6 pt-2">
                    <div className="mb-5">
                        <h3 className="text-xl font-semibold text-text-base">
                            Attendance Insights
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            Overview of attendance
                            distribution, daily trend, and
                            class-wise performance.
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
                            description="Present, absent, late, and excused attendance breakdown across overall attendance history."
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={
                                            stats?.charts
                                                ?.attendanceDistribution ??
                                            []
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={3}
                                    >
                                        {(
                                            stats?.charts
                                                ?.attendanceDistribution ??
                                            []
                                        ).map(
                                            (
                                                _entry,
                                                index
                                            ) => (
                                                <Cell
                                                    key={`attendance-distribution-${index}`}
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

                        {/* Attendance Trend */}
                        <ChartCard
                            title="Attendance Trend"
                            description="Average attendance rate across session dates for the overall attendance history."
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart
                                    data={
                                        stats?.charts
                                            ?.attendanceTrend ??
                                        []
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        opacity={0.2}
                                    />

                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="attendanceRate"
                                        name="Attendance %"
                                        stroke="var(--color-primary)"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        {/* Class-wise Attendance */}
                        <div className="2xl:col-span-2">
                            <ChartCard
                                title="Class-wise Attendance"
                                description="Average attendance percentage of each class based on overall attendance history."
                            >
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart
                                        data={
                                            stats?.charts
                                                ?.classWiseAttendance ??
                                            []
                                        }
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            opacity={0.2}
                                        />
                                        <XAxis dataKey="className" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />

                                        <Bar
                                            dataKey="attendanceRate"
                                            name="Attendance %"
                                            radius={[
                                                10,
                                                10,
                                                0,
                                                0,
                                            ]}
                                        >
                                            {(
                                                stats?.charts
                                                    ?.classWiseAttendance ??
                                                []
                                            ).map(
                                                (
                                                    _entry,
                                                    index
                                                ) => (
                                                    <Cell
                                                        key={`class-attendance-${index}`}
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
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />

                {/* Filters */}
                <div
                    className="
                        grid grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-5
                        gap-3
                        p-6 py-4
                        border-b border-dashed border-border
                    "
                >
                    <div className="lg:col-span-2">
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by subject, class, instructor..."
                        />
                    </div>

                    <SelectBox
                        label="Status"
                        option={status}
                        setOption={setStatus}
                        options={attendanceStatusOptions}
                    />

                    <SelectBox
                        label="Sort"
                        option={sort}
                        setOption={setSort}
                        options={
                            adminAttendanceSortOptions
                        }
                    />

                    <Combobox
                        label="Class"
                        option={selectedClass}
                        setOption={setSelectedClass}
                        options={allClassOptions}
                    />

                    <Combobox
                        label="Subject"
                        option={selectedSubject}
                        setOption={setSelectedSubject}
                        options={allSubjectOptions}
                    />
                </div>

                {/* Entries */}
                <div className="px-6 py-3">
                    <EntriesSelect
                        value={limit}
                        onChange={setLimit}
                        options={limitOptions}
                    />
                </div>

                {/* Table */}
                <div className="min-h-70">
                    <DataTable
                        columns={columns}
                        data={
                            attendanceHistory?.sessions ??
                            []
                        }
                        loading={isTableLoading}
                        getRowId={(row) => row._id}
                        selectedRowIds={selectedRowIds}
                        onSelectedRowIdsChange={(ids) =>
                            setSelectedRowIds(
                                ids as string[]
                            )
                        }
                    />
                </div>

                {/* Pagination */}
                <div className="p-6">
                    {attendanceHistory?.pagination && (
                        <Pagination
                            metaData={{
                                page: attendanceHistory
                                    .pagination.page,
                                limit: attendanceHistory
                                    .pagination.limit,
                                total: attendanceHistory
                                    .pagination.total,
                                totalPages:
                                    attendanceHistory
                                        .pagination
                                        .totalPages,
                            }}
                            loading={isTableLoading}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </section>
        </>
    );
};

export default AttendanceHistory;