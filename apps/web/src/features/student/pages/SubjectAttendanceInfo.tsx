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
import { SEO } from '@/shared/components/SEO';

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

interface InfoCardProps {
    title: string;
    value: string;
    Icon: React.ElementType;
    color: string;
}

const InfoCard = ({
    title,
    value,
    Icon,
    color,
}: InfoCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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

                    <h3 className="mt-2 text-lg font-semibold text-text-base break-words">
                        {value || "--"}
                    </h3>
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
                        ${color}
                    `}
                >
                    <Icon className="h-6 w-6" />
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
        data?.data as
        | SubjectAttendanceInfoResponse
        | undefined;

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
                        <DateTimeCell
                            date={row.date}
                        />
                    ),
                },

                {
                    key: "time",
                    label: "Time",
                    render: (row) => (
                        <SessionTimeCell
                            startTime={
                                row.startTime
                            }
                            endTime={row.endTime}
                        />
                    ),
                },

                {
                    key: "room",
                    label: "Room",
                    render: (row) =>
                        row.room || "--",
                },

                {
                    key: "sessionStatus",
                    label: "Session Status",
                    render: (row) => {
                        const status =
                            row.status?.toLowerCase();

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
                                    px-2
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-medium
                                    ${statusClasses}
                                `}
                            >
                                {row.status ||
                                    "--"}
                            </span>
                        );
                    },
                },

                {
                    key: "attendanceStatus",
                    label: "My Attendance",
                    render: (row) => {
                        const status =
                            row.attendanceStatus;

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
                                    px-2
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-medium
                                    ${statusClasses}
                                `}
                            >
                                {status ===
                                    "not_marked"
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
            <SEO title="Subject Attendance Info | Attendix" description="View attendance details for the selected subject in Attendix." noindex />
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
                <div className="p-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                navigate(-1)
                            }
                            className="
                            h-max w-max
                            p-2
                            backdrop-blur-lg
                            rounded-full
                            cursor-pointer
                            relative
                            hover:bg-surface
                            text-text-base
                            transition-all
                            duration-300
                        "
                        >
                            <ArrowLeft
                                size={20}
                                className="cursor-pointer"
                            />
                        </button>

                        <div>
                            <h2 className="text-2xl font-bold text-text-base">
                                Subject Attendance
                                Details
                            </h2>

                            <p className="text-sm text-text-secondary mt-1">
                                View all sessions and
                                your attendance status
                                for this subject.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />

                {/* Subject / Instructor / Department Info */}
                <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-5
                    px-6
                    pt-6
                "
                >
                    <InfoCard
                        title="Subject"
                        value={
                            attendanceInfo?.subject
                                ? `${attendanceInfo.subject.name} (${attendanceInfo.subject.code})`
                                : "--"
                        }
                        Icon={BookOpen}
                        color="bg-primary/15 text-primary"
                    />

                    <InfoCard
                        title="Instructor"
                        value={
                            attendanceInfo?.instructor
                                ?.name || "--"
                        }
                        Icon={UserRound}
                        color="bg-success/15 text-success"
                    />

                    <InfoCard
                        title="Department"
                        value={
                            attendanceInfo?.department
                                ?.name || "--"
                        }
                        Icon={GraduationCap}
                        color="bg-warning/15 text-warning"
                    />
                </div>

                {/* Attendance Stats */}
                <div
                    className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                    px-6
                    pt-6
                "
                >
                    <InfoCard
                        title="Total Sessions"
                        value={String(
                            stats?.totalSessions ?? 0
                        )}
                        Icon={CalendarCheck2}
                        color="bg-primary/15 text-primary"
                    />

                    <InfoCard
                        title="Present"
                        value={String(
                            stats?.present ?? 0
                        )}
                        Icon={CircleCheckBig}
                        color="bg-success/15 text-success"
                    />

                    <InfoCard
                        title="Absent"
                        value={String(
                            stats?.absent ?? 0
                        )}
                        Icon={CircleX}
                        color="bg-error/15 text-error"
                    />

                    <InfoCard
                        title="Late"
                        value={String(
                            stats?.late ?? 0
                        )}
                        Icon={Clock3}
                        color="bg-warning/15 text-warning"
                    />

                    <InfoCard
                        title="Excused"
                        value={String(
                            stats?.excused ?? 0
                        )}
                        Icon={ShieldCheck}
                        color="bg-primary/15 text-primary"
                    />

                    <InfoCard
                        title="Not Marked"
                        value={String(
                            stats?.notMarked ?? 0
                        )}
                        Icon={FileQuestion}
                        color="bg-muted text-text-secondary"
                    />

                    <InfoCard
                        title="Attendance %"
                        value={`${stats?.attendancePercentage ?? 0}%`}
                        Icon={Percent}
                        color="bg-success/15 text-success"
                    />
                </div>

                {/* Filters */}
                <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-3
                    p-6
                    py-4
                    border-b
                    border-dashed
                    border-border
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

                {/* Entries */}
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

                {/* Table */}
                <div className="min-h-70">
                    <DataTable
                        columns={columns}
                        data={sessions}
                        loading={isPending}
                        showCheckbox={false}
                    />
                </div>

                {/* Pagination */}
                <div className="p-6">
                    {meta && (
                        <Pagination
                            metaData={meta}
                            loading={isPending}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </section>
        </>
    );
};

export default SubjectAttendanceInfo;