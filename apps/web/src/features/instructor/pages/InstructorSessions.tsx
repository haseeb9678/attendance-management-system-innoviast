import {
    CalendarDays,
    ChevronRight,
    Clock3,
    BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { useMySessions } from "../hooks/useInstructor";
import SessionTimeCell from "@/components/common/SessionTimeCell";
import { formatDate } from "@/lib/date";
import { Spinner } from "@/components/ui/spinner";
import StatusBadge from "@/shared/components/StatusBadge";

type SessionTab =
    | "upcoming"
    | "ongoing"
    | "completed";

const InstructorSessions = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] =
        useState<SessionTab>("upcoming");

    const { data, isPending, error, isError } = useMySessions();

    const sessions = data?.data ?? [];

    const tabCounts = useMemo(() => {
        return {
            upcoming: sessions.filter(
                (item: any) =>
                    item.status === "scheduled"
            ).length,
            ongoing: sessions.filter(
                (item: any) =>
                    item.status === "ongoing"
            ).length,
            completed: sessions.filter(
                (item: any) =>
                    item.status === "completed"
            ).length,
        };
    }, [sessions]);

    const filteredSessions = useMemo(() => {
        if (activeTab === "upcoming") {
            return sessions.filter(
                (item: any) =>
                    item.status === "scheduled"
            );
        }

        if (activeTab === "ongoing") {
            return sessions.filter(
                (item: any) =>
                    item.status === "ongoing"
            );
        }

        return sessions.filter(
            (item: any) =>
                item.status === "completed"
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

    if (isPending)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-primary-hover"
        >
            <Spinner className=" size-6" />
            Loading...
        </section>

    if (!isPending && isError)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-text-secondary"
        >
            {error?.message || "Something went wrong"}
        </section>


    return (
        <section
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
                            h-12 w-12
                            rounded-2xl
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
                <div
                    className="
                        inline-flex
                        flex-wrap
                        gap-2
                        rounded-2xl
                        border border-border
                        bg-bg/60
                        p-2
                    "
                >
                    {tabs.map((tab) => {
                        const isActive =
                            activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        tab.key
                                    )
                                }
                                className={`
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    transition-all
                                    cursor-pointer
                                    ${isActive
                                        ? "bg-primary text-white shadow-sm"
                                        : "text-text-secondary hover:bg-bg-secondary hover:text-text-base"
                                    }
                                `}
                            >
                                <span>
                                    {tab.label}
                                </span>

                                <span
                                    className={`
                                        min-w-6
                                        h-6
                                        px-2
                                        rounded-full
                                        text-xs
                                        flex
                                        items-center
                                        justify-center
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
                </div>
            </div>

            {/* Content */}
            {filteredSessions.length === 0 ? (
                <div className="p-6">
                    <div
                        className="
                            border border-dashed border-border
                            rounded-2xl
                            p-10
                            text-center
                            bg-bg/40
                        "
                    >
                        <h3 className="text-lg font-semibold text-text-base">
                            No{" "}
                            {activeTab ===
                                "upcoming"
                                ? "upcoming"
                                : activeTab ===
                                    "ongoing"
                                    ? "ongoing"
                                    : "completed"}{" "}
                            sessions found
                        </h3>

                        <p className="mt-2 text-sm text-text-muted">
                            Sessions in this
                            category will appear
                            here.
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    className="
                        p-6
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        xl:grid-cols-3
                        gap-5
                    "
                >
                    {filteredSessions.map(
                        (item: any) => (
                            <div
                                key={item._id}
                                className="
                                    border border-border
                                    rounded-2xl
                                    p-5
                                    bg-bg/80
                                    backdrop-blur-md
                                    hover:border-primary/40
                                    hover:shadow-lg
                                    transition-all
                                    duration-300
                                "
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-text-base truncate">
                                            {
                                                item
                                                    .teacherAssignment
                                                    .subject
                                                    .name
                                            }
                                        </h3>

                                        <p className="text-sm text-text-secondary truncate">
                                            {
                                                item
                                                    .teacherAssignment
                                                    .class
                                                    .name
                                            }
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
                                            {formatDate(
                                                item.date
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm flex items-center gap-2">
                                            <Clock3
                                                size={
                                                    15
                                                }
                                            />
                                            Time
                                        </span>

                                        <span className="font-medium text-sm text-text-base">
                                            <SessionTimeCell
                                                startTime={
                                                    item.startTime
                                                }
                                                endTime={
                                                    item.endTime
                                                }
                                            />
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm">
                                            Room
                                        </span>

                                        <span className="font-medium text-sm text-text-base">
                                            {item.room ||
                                                "-"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm">
                                            Department
                                        </span>

                                        <span className="font-medium text-sm text-text-base text-right">
                                            {
                                                item
                                                    .teacherAssignment
                                                    .department
                                                    .name
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm">
                                            Status
                                        </span>

                                        <StatusBadge
                                            status={item.status}
                                        />
                                    </div>
                                </div>

                                {item.status ===
                                    "ongoing" && (
                                        <div
                                            className="
                                            mt-6
                                            flex gap-3
                                            text-text-secondary
                                        "
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/instructor/sessions/${item._id}/attendance`
                                                    )
                                                }
                                                className="
                                                flex-1
                                                h-10
                                                rounded-xl
                                                border
                                                border-border
                                                hover:bg-surface
                                                transition
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                cursor-pointer
                                            "
                                            >
                                                Mark
                                                Attendance
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/instructor/sessions/${item._id}/attendance`
                                                    )
                                                }
                                                className="
                                                h-10
                                                w-10
                                                rounded-xl
                                                bg-primary
                                                hover:bg-primary-hover
                                                text-white
                                                flex
                                                items-center
                                                justify-center
                                                transition
                                                cursor-pointer
                                            "
                                            >
                                                <ChevronRight
                                                    size={
                                                        18
                                                    }
                                                />
                                            </button>
                                        </div>
                                    )}
                            </div>
                        )
                    )}
                </div>
            )}
        </section>
    );
};

export default InstructorSessions;