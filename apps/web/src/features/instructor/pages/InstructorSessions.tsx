import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
    CalendarDays,
    ChevronRight,
    Clock3,
    BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DataTable, {
    type TableColumn,
} from "@/components/common/Table";
import SessionTimeCell from "@/components/common/SessionTimeCell";
import DateTimeCell from "@/components/common/DateTimeCell";
import StatusBadge from "@/shared/components/StatusBadge";
import { Spinner } from "@/components/ui/spinner";
import { SEO } from "@/shared/components/SEO";
import { formatDate } from "@/lib/date";

import { useMySessions } from "../hooks/useInstructor";

interface InstructorSession {
    _id: string;
    room?: string;
    date: string;
    startTime: string;
    endTime: string;
    status: "scheduled" | "ongoing" | "completed" | "cancelled";

    teacherAssignment: {
        _id: string;
        subject?: {
            _id: string;
            name: string;
            code?: string;
        };
        class?: {
            _id: string;
            name: string;
            code?: string;
        };
        department?: {
            _id: string;
            name: string;
            code?: string;
        };
    };
}

type SessionTab = "upcoming" | "ongoing" | "completed";

const InstructorSessions = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SessionTab>("upcoming");

    const { data, isPending, error, isError } = useMySessions();

    const sessions =
        (data?.data as InstructorSession[] | undefined) ?? [];

    /**
     * Counts
     */
    const tabCounts = useMemo(() => {
        return {
            upcoming: sessions.filter(
                (item) => item.status === "scheduled"
            ).length,
            ongoing: sessions.filter(
                (item) => item.status === "ongoing"
            ).length,
            completed: sessions.filter(
                (item) => item.status === "completed"
            ).length,
        };
    }, [sessions]);

    /**
     * Filtered sessions by active tab
     */
    const filteredSessions = useMemo(() => {
        if (activeTab === "upcoming") {
            return sessions.filter(
                (item) => item.status === "scheduled"
            );
        }

        if (activeTab === "ongoing") {
            return sessions.filter(
                (item) => item.status === "ongoing"
            );
        }

        return sessions.filter(
            (item) => item.status === "completed"
        );
    }, [activeTab, sessions]);

    const tabs: Array<{
        key: SessionTab;
        label: string;
        count: number;
    }> = [
            {
                key: "upcoming",
                label: "Upcoming",
                count: tabCounts.upcoming,
            },
            {
                key: "ongoing",
                label: "Ongoing",
                count: tabCounts.ongoing,
            },
            {
                key: "completed",
                label: "Completed",
                count: tabCounts.completed,
            },
        ];

    /**
     * Completed sessions table columns
     */
    const completedColumns =
        useMemo<TableColumn<InstructorSession>[]>(
            () => [
                {
                    key: "subject",
                    label: "Subject",
                    render: (row) => (
                        <div className="flex flex-col">
                            <span className="font-medium text-text-base">
                                {row.teacherAssignment?.subject?.name ?? "--"}
                            </span>
                            <span className="text-xs text-text-secondary">
                                {row.teacherAssignment?.subject?.code ?? "--"}
                            </span>
                        </div>
                    ),
                },
                {
                    key: "class",
                    label: "Class",
                    render: (row) => (
                        <div className="flex flex-col">
                            <span className="font-medium text-text-base">
                                {row.teacherAssignment?.class?.name ?? "--"}
                            </span>
                            <span className="text-xs text-text-secondary">
                                {row.teacherAssignment?.class?.code ?? "--"}
                            </span>
                        </div>
                    ),
                },
                {
                    key: "department",
                    label: "Department",
                    render: (row) =>
                        row.teacherAssignment?.department?.name ?? "--",
                },
                {
                    key: "room",
                    label: "Room",
                    render: (row) => row.room || "--",
                },
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
                    key: "status",
                    label: "Status",
                    render: (row) => (
                        <StatusBadge status={row.status} />
                    ),
                },
            ],
            []
        );

    if (isPending) {
        return (
            <section
                className="
                    flex justify-center items-center gap-2
                    flex-1 text-primary-hover
                "
            >
                <Spinner className="size-6" />
                Loading...
            </section>
        );
    }

    if (!isPending && isError) {
        return (
            <section
                className="
                    flex justify-center items-center gap-2
                    flex-1 text-text-secondary
                "
            >
                {error?.message || "Something went wrong"}
            </section>
        );
    }

    return (
        <>
            <SEO
                title="Instructor Sessions | Attendix"
                description="Track your sessions, schedules, and attendance details in Attendix."
                noindex
            />

            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="
                    bg-bg-card
                    border border-border
                    rounded-2xl
                    shadow-sm
                    flex flex-col
                    flex-1
                    min-w-0
                    h-max
                    overflow-hidden
                "
            >
                {/* Header */}
                <div className="p-6 border-b border-dashed border-border">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-text-base">
                                My Sessions
                            </h2>

                            <p className="text-sm text-text-muted mt-1">
                                View and manage your teaching schedule.
                            </p>
                        </div>

                        <div
                            className="
                                h-12 w-12 rounded-2xl
                                bg-primary/10
                                flex items-center justify-center
                                shrink-0
                            "
                        >
                            <CalendarDays
                                className="text-primary"
                                size={22}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="
                            inline-flex flex-wrap gap-2
                            rounded-2xl border border-border
                            bg-bg/60 p-2
                        "
                    >
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`
                                        inline-flex items-center gap-2
                                        rounded-xl px-4 py-2.5 text-sm font-medium
                                        transition-all cursor-pointer
                                        ${isActive
                                            ? "bg-primary text-white shadow-sm"
                                            : "text-text-secondary hover:bg-bg-secondary hover:text-text-base"
                                        }
                                    `}
                                >
                                    <span>{tab.label}</span>

                                    <span
                                        className={`
                                            min-w-6 h-6 px-2 rounded-full text-xs
                                            flex items-center justify-center
                                            ${isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-primary/10 text-primary"
                                            }
                                        `}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Empty state */}
                {filteredSessions.length === 0 ? (
                    <div className="p-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="
                                border border-dashed border-border
                                rounded-2xl p-10 text-center bg-bg/40
                            "
                        >
                            <h3 className="text-lg font-semibold text-text-base">
                                No{" "}
                                {activeTab === "upcoming"
                                    ? "upcoming"
                                    : activeTab === "ongoing"
                                        ? "ongoing"
                                        : "completed"}{" "}
                                sessions found
                            </h3>

                            <p className="mt-2 text-sm text-text-muted">
                                Sessions in this category will appear here.
                            </p>
                        </motion.div>
                    </div>
                ) : (
                    <>
                        {/* Upcoming + Ongoing => Cards */}
                        {(activeTab === "upcoming" ||
                            activeTab === "ongoing") && (
                                <div
                                    className="
                                    p-6 grid grid-cols-1
                                    lg:grid-cols-2 xl:grid-cols-3 gap-5
                                "
                                >
                                    {filteredSessions.map((item) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.25,
                                                ease: "easeOut",
                                            }}
                                            whileHover={{
                                                y: -4,
                                                scale: 1.01,
                                            }}
                                            className="
                                            border border-border rounded-2xl p-5
                                            bg-bg/80 backdrop-blur-md
                                            hover:border-primary/40
                                            hover:shadow-lg
                                            transition-all duration-300
                                        "
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-semibold text-text-base truncate">
                                                        {item.teacherAssignment?.subject?.name || "--"}
                                                    </h3>

                                                    <p className="text-sm text-text-secondary truncate">
                                                        {item.teacherAssignment?.class?.name || "--"}
                                                    </p>
                                                </div>

                                                <BookOpen
                                                    className="text-primary shrink-0"
                                                    size={22}
                                                />
                                            </div>

                                            <div className="mt-5 space-y-3 text-text-secondary">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-sm">
                                                        Date
                                                    </span>

                                                    <span className="font-medium text-sm text-text-base">
                                                        {formatDate(item.date)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-sm flex items-center gap-2">
                                                        <Clock3 size={15} />
                                                        Time
                                                    </span>

                                                    <span className="font-medium text-sm text-text-base">
                                                        <SessionTimeCell
                                                            startTime={item.startTime}
                                                            endTime={item.endTime}
                                                        />
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-sm">
                                                        Room
                                                    </span>

                                                    <span className="font-medium text-sm text-text-base">
                                                        {item.room || "-"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-sm">
                                                        Department
                                                    </span>

                                                    <span className="font-medium text-sm text-text-base text-right">
                                                        {item.teacherAssignment?.department?.name || "--"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-sm">
                                                        Status
                                                    </span>

                                                    <StatusBadge status={item.status} />
                                                </div>
                                            </div>

                                            {item.status === "ongoing" && (
                                                <div
                                                    className="
                                                    mt-6 flex gap-3 text-text-secondary
                                                "
                                                >
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/instructor/sessions/${item._id}/attendance`
                                                            )
                                                        }
                                                        className="
                                                        flex-1 h-10 rounded-xl
                                                        border border-border
                                                        hover:bg-surface transition
                                                        flex items-center justify-center gap-2
                                                        cursor-pointer
                                                    "
                                                    >
                                                        Mark Attendance
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/instructor/sessions/${item._id}/attendance`
                                                            )
                                                        }
                                                        className="
                                                        h-10 w-10 rounded-xl
                                                        bg-primary hover:bg-primary-hover
                                                        text-white flex items-center justify-center
                                                        transition cursor-pointer
                                                    "
                                                    >
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                        {/* Completed => Table */}
                        {activeTab === "completed" && (
                            <div className="p-6">
                                <div className="min-h-70">
                                    <DataTable
                                        columns={completedColumns}
                                        data={filteredSessions}
                                        loading={isPending}
                                        showCheckbox={false}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.section>
        </>
    );
};

export default InstructorSessions;