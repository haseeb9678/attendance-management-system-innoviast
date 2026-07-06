import { motion } from "framer-motion";
import { useMemo } from "react";
import {
    BookOpen,
    CalendarClock,
    GraduationCap,
} from "lucide-react";

import DataTable, {
    type TableColumn,
} from "@/components/common/Table";
import DateTimeCell from "@/components/common/DateTimeCell";

import { useStudentDashboard } from "@/features/student/hooks/useStudent";
import SessionTimeCell from "@/components/common/SessionTimeCell";
import { SEO } from '@/shared/components/SEO';

/**
 * =========================
 * Types
 * =========================
 */
interface Session {
    _id: string;

    room: string;

    date: string;

    startTime: string;

    endTime: string;

    status: string;

    teacherAssignment: {
        _id: string;

        subject?: {
            _id: string;
            name: string;
            code: string;
        };

        class?: {
            _id: string;
            name: string;
            code: string;
        };

        department?: {
            _id: string;
            name: string;
            code: string;
        };

        instructor?: {
            _id: string;
            name: string;
            email: string;
        };
    };
}

interface DashboardData {
    overview: {
        className: string | null;
        classCode: string | null;
        totalSubjects: number;
        totalSessions: number;
    };

    recentSessions: Session[];
}

interface DashboardCardProps {
    title: string;
    value: number | string;
    Icon: React.ElementType;
    color: string;
}

/**
 * =========================
 * Dashboard Card
 * =========================
 */
const DashboardCard = ({
    title,
    value,
    Icon,
    color,
}: DashboardCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.01 }}
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
                    <p className="text-text-secondary text-sm font-medium">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-text-base">
                        {value}
                    </h2>
                </div>

                <div
                    className={`
                        h-14 w-14 rounded-2xl flex items-center justify-center shrink-0
                        ${color}
                    `}
                >
                    <Icon className="h-7 w-7" />
                </div>
            </div>
        </motion.div>

    );
};

const StudentDashboard = () => {
    const { data, isPending } = useStudentDashboard();

    const dashboard =
        data?.data as DashboardData | undefined;

    const recentSessionColumns =
        useMemo<TableColumn<Session>[]>(
            () => [
                {
                    key: "subject",
                    label: "Subject",
                    render: (row) =>
                        row.teacherAssignment?.subject
                            ?.name ?? "--",
                },

                {
                    key: "class",
                    label: "Class",
                    render: (row) =>
                        row.teacherAssignment?.class
                            ?.name ?? "--",
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
                    render: (row) =>
                        <SessionTimeCell
                            startTime={row.startTime}
                            endTime={row.endTime}
                        />,
                },
            ],
            []
        );

    return (
        <>
            <SEO title="Dashboard | Attendix" description="Overview of attendance, sessions, and academic summary in Attendix." noindex />


            <div
                className="
                flex
                flex-col
                gap-6
                flex-1
                h-max
                min-w-0
            "
            >
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="
                    bg-bg-card
                    border
                    border-border
                    rounded-md
                    shadow-sm
                    p-6
                "
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-text-base">
                                Student Dashboard
                            </h2>

                            <p className="text-text-secondary mt-1">
                                Overview of your class, subjects, and recent sessions.
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-3
                        gap-5
                        mt-8
                    "
                    >
                        <DashboardCard
                            title="My Class"
                            value={
                                dashboard?.overview.className ??
                                "--"
                            }
                            Icon={GraduationCap}
                            color="bg-success/20 text-success"
                        />

                        <DashboardCard
                            title="Subjects"
                            value={
                                dashboard?.overview
                                    .totalSubjects ?? 0
                            }
                            Icon={BookOpen}
                            color="bg-primary/20 text-primary"
                        />

                        <DashboardCard
                            title="Sessions"
                            value={
                                dashboard?.overview
                                    .totalSessions ?? 0
                            }
                            Icon={CalendarClock}
                            color="bg-warning/20 text-warning"
                        />
                    </div>

                    <div className="mt-8 border-t border-dashed border-border" />

                    <div className="mt-8">
                        <div className="mb-5">
                            <h3 className="text-xl font-semibold text-text-base">
                                Recent Sessions
                            </h3>

                            <p className="mt-1 text-sm text-text-secondary">
                                Your latest class sessions.
                            </p>
                        </div>

                        <div className="min-h-70">
                            <DataTable
                                columns={recentSessionColumns}
                                data={dashboard?.recentSessions}
                                loading={isPending}
                                showCheckbox={false}
                            />
                        </div>
                    </div>
                </motion.section>
            </div>
        </>
    );
};

export default StudentDashboard;