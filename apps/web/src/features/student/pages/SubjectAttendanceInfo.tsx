import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    UserRound,
    CalendarCheck2,
    CircleCheckBig,
    CircleX,
    Clock3,
    ShieldCheck,
    FileQuestion,
    Percent,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DataTable, {
    type TableColumn,
} from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import EntriesSelect from "@/components/common/EnteriesSelect";

import {
    limitOptions,
    sortOptions,
} from "@/shared/constants/filters";
import useDebounce from "@/shared/hooks/useDebounce";

import DateTimeCell from "@/components/common/DateTimeCell";
import SessionTimeCell from "@/components/common/SessionTimeCell";

import { useStudentAttendanceSubjectDetails } from "@/features/student/hooks/useStudent";
import { SEO } from "@/shared/components/SEO";

interface SubjectAttendanceSession {
    _id: string;
    room: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    attendanceStatus:
    | "present"
    | "absent"
    | "late"
    | "excused"
    | "not_marked";
}

interface SubjectAttendanceStats {
    totalSessions: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    notMarked: number;
    attendancePercentage: number;
}

interface SubjectAttendanceInfoResponse {
    subject: {
        _id: string;
        name: string;
        code: string;
        creditHours?: number;
    };
    department: {
        _id: string;
        name: string;
        code: string;
    };
    instructor: {
        _id: string;
        name: string;
        email: string;
    };
    stats: SubjectAttendanceStats;
    sessions: SubjectAttendanceSession[];
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
    compact?: boolean;
}

const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    compact = false,
}: StatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
                rounded-2xl border border-border bg-bg
                transition-all hover:border-primary/25 hover:shadow-sm
                ${compact ? "p-4" : "p-5"}
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-text-secondary">
                        {title}
                    </p>

                    <h3
                        className={`
                            mt-2 font-bold text-text-base
                            ${compact ? "text-xl" : "text-2xl"}
                        `}
                    >
                        {value || "--"}
                    </h3>
                </div>

                <div
                    className={`
                        h-11 w-11 rounded-2xl flex items-center justify-center shrink-0
                        ${color}
                    `}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </motion.div>
    );
};

const SubjectAttendanceInfo = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(sortOptions[0]);
    const [limit, setLimit] = useState(limitOptions[0]);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending } =
        useStudentAttendanceSubjectDetails({
            subjectId: subjectId || "",
            page,
            limit: limit.value,
            search: debouncedSearch,
            sort: sort.value as "newest" | "oldest",
        });

    const attendanceInfo =
        data?.data as SubjectAttendanceInfoResponse | undefined;

    const sessions = attendanceInfo?.sessions ?? [];
    const stats = attendanceInfo?.stats;
    const meta = data?.meta;

    const columns =
        useMemo<TableColumn<SubjectAttendanceSession>[]>(
            () => [
                {
                    key: "date",
                    label: "Date",
                    render: (row) => (
                        <DateTimeCell date={row.date} />
                    ),
                },
                {
                    key: "time",
                    label: "Time",
                    render: (row) => (
                        <SessionTimeCell
                            startTime={row.startTime}
                            endTime={row.endTime}
                        />
                    ),
                },
                {
                    key: "room",
                    label: "Room",
                    render: (row) => row.room || "--",
                },
                {
                    key: "sessionStatus",
                    label: "Session Status",
                    render: (row) => {
                        const status = row.status?.toLowerCase();

                        const statusClasses =
                            status === "completed"
                                ? "bg-success/15 text-success"
                                : status === "scheduled"
                                    ? "bg-primary/15 text-primary"
                                    : status === "ongoing"
                                        ? "bg-warning/15 text-warning"
                                        : status === "cancelled"
                                            ? "bg-error/15 text-error"
                                            : "bg-muted text-text-secondary";

                        return (
                            <span
                                className={`
                                    px-2 py-1 rounded-full text-xs font-medium
                                    ${statusClasses}
                                `}
                            >
                                {row.status || "--"}
                            </span>
                        );
                    },
                },
                {
                    key: "attendanceStatus",
                    label: "My Attendance",
                    render: (row) => {
                        const status = row.attendanceStatus;

                        const statusClasses =
                            status === "present"
                                ? "bg-success/15 text-success"
                                : status === "absent"
                                    ? "bg-error/15 text-error"
                                    : status === "late"
                                        ? "bg-warning/15 text-warning"
                                        : status === "excused"
                                            ? "bg-primary/15 text-primary"
                                            : "bg-muted text-text-secondary";

                        return (
                            <span
                                className={`
                                    px-2 py-1 rounded-full text-xs font-medium capitalize
                                    ${statusClasses}
                                `}
                            >
                                {status === "not_marked"
                                    ? "Not Marked"
                                    : status}
                            </span>
                        );
                    },
                },
            ],
            []
        );

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, sort, limit]);

    return (
        <>
            <SEO
                title="Subject Attendance Info | Attendix"
                description="View attendance details for the selected subject in Attendix."
                noindex
            />

            <section
                className="
                    flex flex-col gap-6 flex-1 min-w-0 h-max
                "
            >
                {/* Header */}
                <div
                    className="
                        bg-bg-card border border-border rounded-2xl shadow-sm
                        p-6
                    "
                >
                    <div className="flex gap-3 items-start">
                        <button
                            onClick={() => navigate(-1)}
                            className="
                                h-10 w-10 rounded-full flex items-center justify-center
                                hover:bg-surface text-text-base transition-all shrink-0
                            "
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div>
                            <h2 className="text-2xl font-bold text-text-base">
                                Subject Attendance Details
                            </h2>

                            <p className="text-sm text-text-secondary mt-1">
                                View all sessions and your attendance performance for this subject.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subject overview */}
                <div
                    className="
                        bg-bg-card border border-border rounded-2xl shadow-sm
                        p-6
                    "
                >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-sm text-text-secondary">
                                Subject
                            </p>
                            <h3 className="mt-1 text-xl font-bold text-text-base">
                                {attendanceInfo?.subject
                                    ? `${attendanceInfo.subject.name} (${attendanceInfo.subject.code})`
                                    : "--"}
                            </h3>
                        </div>

                        {attendanceInfo?.subject?.creditHours ? (
                            <div className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                                {attendanceInfo.subject.creditHours} Credit Hours
                            </div>
                        ) : null}
                    </div>

                    <div
                        className="
                            mt-6 grid grid-cols-1 md:grid-cols-3 gap-4
                        "
                    >
                        <div className="rounded-2xl border border-border bg-bg p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-success/15 text-success flex items-center justify-center">
                                    <UserRound size={18} />
                                </div>

                                <div>
                                    <p className="text-xs text-text-secondary">
                                        Instructor
                                    </p>
                                    <p className="font-semibold text-text-base">
                                        {attendanceInfo?.instructor?.name || "--"}
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        {attendanceInfo?.instructor?.email || "--"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-bg p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center">
                                    <GraduationCap size={18} />
                                </div>

                                <div>
                                    <p className="text-xs text-text-secondary">
                                        Department
                                    </p>
                                    <p className="font-semibold text-text-base">
                                        {attendanceInfo?.department?.name || "--"}
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        {attendanceInfo?.department?.code || "--"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-bg p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                                    <BookOpen size={18} />
                                </div>

                                <div>
                                    <p className="text-xs text-text-secondary">
                                        Subject Code
                                    </p>
                                    <p className="font-semibold text-text-base">
                                        {attendanceInfo?.subject?.code || "--"}
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        Attendance tracking overview
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance overview */}
                <div
                    className="
                        bg-bg-card border border-border rounded-2xl shadow-sm
                        p-6
                    "
                >
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-text-base">
                            Attendance Overview
                        </h3>
                        <p className="text-sm text-text-secondary mt-1">
                            Summary of your attendance across all sessions of this subject.
                        </p>
                    </div>

                    {/* Primary stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="Attendance %"
                            value={`${stats?.attendancePercentage ?? 0}%`}
                            icon={Percent}
                            color="bg-orange-500/15 text-orange-700 hover:border-orange-700!"
                        />

                        <StatCard
                            title="Present"
                            value={String(stats?.present ?? 0)}
                            icon={CircleCheckBig}
                            color="bg-success/15 text-success"
                        />

                        <StatCard
                            title="Absent"
                            value={String(stats?.absent ?? 0)}
                            icon={CircleX}
                            color="bg-error/15 text-error"
                        />

                        <StatCard
                            title="Total Sessions"
                            value={String(stats?.totalSessions ?? 0)}
                            icon={CalendarCheck2}
                            color="bg-primary/15 text-primary"
                        />
                    </div>

                    {/* Secondary stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <StatCard
                            title="Late"
                            value={String(stats?.late ?? 0)}
                            icon={Clock3}
                            color="bg-warning/15 text-warning"
                            compact
                        />

                        <StatCard
                            title="Excused"
                            value={String(stats?.excused ?? 0)}
                            icon={ShieldCheck}
                            color="bg-purple-500/15 text-purple-700"
                            compact
                        />

                        <StatCard
                            title="Not Marked"
                            value={String(stats?.notMarked ?? 0)}
                            icon={FileQuestion}
                            color="bg-pink-500/15 text-pink-700"
                            compact
                        />
                    </div>
                </div>

                {/* Sessions history */}
                <div
                    className="
                        bg-bg-card border border-border rounded-2xl shadow-sm
                        overflow-hidden
                    "
                >
                    <div className="p-6 border-b border-dashed border-border">
                        <h3 className="text-lg font-semibold text-text-base">
                            Session Attendance History
                        </h3>
                        <p className="text-sm text-text-secondary mt-1">
                            Browse all subject sessions and see your attendance status for each one.
                        </p>
                    </div>

                    {/* Filters */}
                    <div
                        className="
                            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                            gap-3 p-6 py-4 border-b border-dashed border-border
                        "
                    >
                        <div className="lg:col-span-2">
                            <SearchBox
                                value={search}
                                onChange={(value) => {
                                    setPage(1);
                                    setSearch(value);
                                }}
                                placeholder="Search by room..."
                            />
                        </div>

                        <SelectBox
                            label="Sort"
                            option={sort}
                            setOption={(value) => {
                                setPage(1);
                                setSort(value);
                            }}
                            options={sortOptions}
                        />
                    </div>

                    <div className="px-6 py-3">
                        <EntriesSelect
                            value={limit}
                            onChange={(value) => {
                                setPage(1);
                                setLimit(value);
                            }}
                            options={limitOptions}
                        />
                    </div>

                    <div className="min-h-70">
                        <DataTable
                            columns={columns}
                            data={sessions}
                            loading={isPending}
                            showCheckbox={false}
                        />
                    </div>

                    <div className="p-6">
                        {meta && (
                            <Pagination
                                metaData={meta}
                                loading={isPending}
                                onPageChange={setPage}
                            />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default SubjectAttendanceInfo;