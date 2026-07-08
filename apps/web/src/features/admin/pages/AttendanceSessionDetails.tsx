import { useMemo, useState } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    CircleOff,
    Clock3,
    FileText,
    ShieldAlert,
    User2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import DataTable, {
    type TableColumn,
} from "@/components/common/Table";
import ExportButton from "@/components/common/ExportButton";
import FormButton from "@/components/common/FormButton";
import DateTimeCell from "@/components/common/DateTimeCell";

import { SEO } from "@/shared/components/SEO";
import { useAdminAttendanceSessionDetails } from "../hooks/useAdmin";
import { sessionAttendanceExportColumns } from "../constants/sessionAttendanceExportColumns";

type AttendanceDistributionItem = {
    name: string;
    value: number;
};

type SessionInfo = {
    _id: string;
    status: string;
    sessionDate?: string;
    startTime?: string | null;
    endTime?: string | null;
    createdAt?: string;

    subject?: {
        _id: string;
        name: string;
        code?: string;
    } | null;

    class?: {
        _id: string;
        name: string;
        section?: string;
    } | null;

    department?: {
        _id: string;
        name: string;
    } | null;

    instructor?: {
        _id: string;
        fullName?: string;
        email?: string;
    } | null;
};

type AttendanceSummary = {
    totalStudents: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
};

type StudentAttendanceRow = {
    _id: string;
    status: string;
    remarks?: string;
    markedAt?: string | null;
    student: {
        _id?: string | null;
        fullName?: string;
        email?: string;
        rollNumber?: string;
    };
};

type AdminAttendanceSessionDetailsResponse = {
    session: SessionInfo;
    summary: AttendanceSummary;
    charts: {
        attendanceDistribution: AttendanceDistributionItem[];
    };
    students: StudentAttendanceRow[];
};

const PIE_COLORS = [
    "var(--color-success)",
    "var(--color-error)",
    "var(--color-warning)",
    "var(--color-primary)",
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

interface InfoCardItemProps {
    label: string;
    value?: React.ReactNode;
}

const InfoCardItem = ({
    label,
    value,
}: InfoCardItemProps) => {
    return (
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                {label}
            </p>
            <div className="mt-1 text-sm font-medium text-text-base break-words">
                {value || "--"}
            </div>
        </div>
    );
};

const renderStatusBadge = (status?: string) => {
    const normalized = status?.toLowerCase() || "";

    let classes = "bg-muted text-text-secondary";

    if (normalized === "present") {
        classes = "bg-success/15 text-success";
    } else if (normalized === "absent") {
        classes = "bg-error/15 text-error";
    } else if (normalized === "late") {
        classes = "bg-warning/15 text-warning";
    } else if (normalized === "excused") {
        classes = "bg-primary/15 text-primary";
    } else if (normalized === "completed") {
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



const AttendanceSessionDetails = () => {
    const navigate = useNavigate();
    const { sessionId } =
        useParams<{ sessionId: string }>();

    const [selectedRowIds, setSelectedRowIds] =
        useState<string[]>([]);

    const { data, isPending } =
        useAdminAttendanceSessionDetails(
            sessionId
        );

    const attendanceDetails =
        data?.data as
        | AdminAttendanceSessionDetailsResponse
        | undefined;

    const session = attendanceDetails?.session;
    const summary = attendanceDetails?.summary;
    const students =
        attendanceDetails?.students ?? [];
    const chartData =
        attendanceDetails?.charts
            ?.attendanceDistribution ?? [];

    const columns = useMemo<
        TableColumn<StudentAttendanceRow>[]
    >(
        () => [
            {
                key: "student",
                label: "Student",
                render: (row) => (
                    <div className="min-w-0">
                        <p className="font-medium text-text-base">
                            {row.student?.fullName ||
                                "--"}
                        </p>
                        <p className="text-xs text-text-secondary">
                            {row.student?.email ||
                                "--"}
                        </p>
                    </div>
                ),
            },
            {
                key: "rollNumber",
                label: "Roll Number",
                render: (row) =>
                    row.student?.rollNumber || "--",
            },
            {
                key: "status",
                label: "Status",
                render: (row) =>
                    renderStatusBadge(row.status),
            },
            {
                key: "remarks",
                label: "Remarks",
                render: (row) => (
                    <span className="text-sm text-text-base">
                        {row.remarks || "--"}
                    </span>
                ),
            },
            {
                key: "markedAt",
                label: "Marked At",
                render: (row) =>
                    row.markedAt ? (
                        <DateTimeCell
                            date={row.markedAt}
                        />
                    ) : (
                        "--"
                    ),
            },
        ],
        []
    );

    return (
        <>
            <SEO
                title="Session Attendance Details | Attendix"
                description="View full attendance details of a specific session."
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
                        lg:flex-row
                        justify-between
                        gap-5
                    "
                >
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                onClick={() => navigate(-1)}
                                className="
                        p-2 rounded-full cursor-pointer
                        hover:bg-surface transition-all text-text-base
                    "
                            >
                                <ArrowLeft
                                    size={20}

                                />
                            </button>

                            <h2 className="text-2xl font-bold text-text-base">
                                Session Attendance Details
                            </h2>
                        </div>

                        <p className="text-sm text-text-secondary mt-3">
                            View full session information,
                            attendance summary, and
                            student attendance records.
                        </p>
                    </div>

                    <ExportButton
                        data={students}
                        selectedRowIds={selectedRowIds}
                        getRowId={(row) => row._id}
                        fileName="session-attendance-details"
                        columns={
                            sessionAttendanceExportColumns
                        }
                        className="w-max"
                    />
                </div>

                <div className="border-t border-dashed border-border" />

                {/* Session Info */}
                <div className="px-6 pt-6">
                    <div
                        className="
                            rounded-2xl border border-border
                            bg-bg p-5 shadow-sm
                        "
                    >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                                <h3 className="text-lg font-semibold text-text-base">
                                    Session Information
                                </h3>
                                <p className="mt-1 text-sm text-text-secondary">
                                    Overview of the selected
                                    attendance session.
                                </p>
                            </div>

                            {renderStatusBadge(
                                session?.status
                            )}
                        </div>

                        <div
                            className="
                                mt-6 grid grid-cols-1 gap-5
                                md:grid-cols-2 xl:grid-cols-4
                            "
                        >
                            <InfoCardItem
                                label="Subject"
                                value={
                                    session?.subject
                                        ?.name || "--"
                                }
                            />

                            <InfoCardItem
                                label="Subject Code"
                                value={
                                    session?.subject
                                        ?.code || "--"
                                }
                            />

                            <InfoCardItem
                                label="Class"
                                value={`${session?.class?.name || "--"}${session?.class?.section ? ` (${session.class.section})` : ""}`}
                            />



                            <InfoCardItem
                                label="Department"
                                value={
                                    session?.department
                                        ?.name || "--"
                                }
                            />

                            <InfoCardItem
                                label="Instructor"
                                value={
                                    session?.instructor
                                        ?.fullName ||
                                    session?.instructor
                                        ?.email ||
                                    "--"
                                }
                            />

                            <InfoCardItem
                                label="Session Date"
                                value={
                                    session?.sessionDate ? (
                                        <DateTimeCell
                                            date={
                                                session.sessionDate
                                            }
                                        />
                                    ) : (
                                        "--"
                                    )
                                }
                            />

                            <InfoCardItem
                                label="Created At"
                                value={
                                    session?.createdAt ? (
                                        <DateTimeCell
                                            date={
                                                session.createdAt
                                            }
                                        />
                                    ) : (
                                        "--"
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="px-6 pt-2">
                    <div
                        className="
                            grid grid-cols-1 gap-5
                            sm:grid-cols-2
                            xl:grid-cols-3
                            2xl:grid-cols-6
                        "
                    >
                        <StatCard
                            title="Total Students"
                            value={
                                summary?.totalStudents ??
                                0
                            }
                            subtitle="Total attendance records for this session"
                            icon={User2}
                            iconClassName="bg-primary/15 text-primary"
                        />

                        <StatCard
                            title="Present"
                            value={
                                summary?.present ?? 0
                            }
                            subtitle="Students marked present"
                            icon={CheckCircle2}
                            valueClassName="text-success"
                            iconClassName="bg-success/15 text-success"
                        />

                        <StatCard
                            title="Absent"
                            value={
                                summary?.absent ?? 0
                            }
                            subtitle="Students marked absent"
                            icon={CircleOff}
                            valueClassName="text-error"
                            iconClassName="bg-error/15 text-error"
                        />

                        <StatCard
                            title="Late"
                            value={summary?.late ?? 0}
                            subtitle="Students marked late"
                            icon={Clock3}
                            valueClassName="text-warning"
                            iconClassName="bg-warning/15 text-warning"
                        />

                        <StatCard
                            title="Excused"
                            value={
                                summary?.excused ?? 0
                            }
                            subtitle="Students marked excused"
                            icon={FileText}
                            valueClassName="text-primary"
                            iconClassName="bg-primary/15 text-primary"
                        />

                        <StatCard
                            title="Attendance %"
                            value={`${summary?.attendanceRate ?? 0}%`}
                            subtitle="Present attendance percentage"
                            icon={ShieldAlert}
                            iconClassName="bg-primary/15 text-primary"
                        />
                    </div>
                </div>

                {/* Chart */}
                <div className="px-6 pt-2">
                    <div
                        className="
                            rounded-2xl border border-border
                            bg-bg p-5 shadow-sm
                        "
                    >
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-text-base">
                                Attendance Distribution
                            </h3>

                            <p className="mt-1 text-sm text-text-secondary">
                                Present, absent, late, and
                                excused attendance breakdown
                                for this session.
                            </p>
                        </div>

                        <div className="h-[340px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={115}
                                        paddingAngle={3}
                                    >
                                        {chartData.map(
                                            (
                                                _entry,
                                                index
                                            ) => (
                                                <Cell
                                                    key={`session-attendance-distribution-${index}`}
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
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />

                {/* Students Table */}
                <div className="px-6 pt-3">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-text-base">
                            Student Attendance
                        </h3>
                        <p className="mt-1 text-sm text-text-secondary">
                            Detailed attendance records of
                            students for this session.
                        </p>
                    </div>
                </div>

                <div className="min-h-70">
                    <DataTable
                        columns={columns}
                        data={students}
                        loading={isPending}
                        getRowId={(row) => row._id}
                        selectedRowIds={selectedRowIds}
                        onSelectedRowIdsChange={(ids) =>
                            setSelectedRowIds(
                                ids as string[]
                            )
                        }
                    />
                </div>

                <div className="p-6 pt-0">
                    <p className="text-sm text-text-secondary">
                        Total students in this session:{" "}
                        <span className="font-semibold text-text-base">
                            {summary?.totalStudents ?? 0}
                        </span>
                    </p>
                </div>
            </section>
        </>
    );
};

export default AttendanceSessionDetails;