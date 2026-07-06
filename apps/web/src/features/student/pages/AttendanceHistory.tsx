import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import DataTable, {
    type TableColumn,
} from "@/components/common/Table";
import FormButton from "@/components/common/FormButton";

import { sortOptions } from "@/shared/constants/filters";
import useDebounce from "@/shared/hooks/useDebounce";

import { SEO } from '@/shared/components/SEO';
import {

    useMyAttendanceHistory,

} from "@/features/student/hooks/useStudent";

interface StudentAttendanceHistoryItem {
    teacherAssignmentId: string;

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

    totalSessions: number;
    totalPresents: number;
    attendancePercentage: number;
}

const AttendanceHistory = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(sortOptions[0]);

    const debouncedSearch = useDebounce(search, 500);



    /**
     * Attendance History Summary
     */
    const {
        data,
        isPending: isLoading,
    } = useMyAttendanceHistory({
        search: debouncedSearch,
        sort: sort.value as "newest" | "oldest",
    });

    const history =
        (data?.data as
            | StudentAttendanceHistoryItem[]
            | undefined) ?? [];

    const handleView = (
        row: StudentAttendanceHistoryItem
    ) => {
        navigate(
            `/student/attendance/history/subject/${row.subject._id}`
        );
    };

    const columns =
        useMemo<
            TableColumn<StudentAttendanceHistoryItem>[]
        >(
            () => [
                {
                    key: "subject",
                    label: "Subject",
                    render: (row) => (
                        <div className="flex flex-col">
                            <span className="font-medium text-text-base">
                                {row.subject?.name ??
                                    "--"}
                            </span>

                            <span className="text-xs text-text-secondary">
                                {row.subject?.code ??
                                    "--"}
                            </span>
                        </div>
                    ),
                },

                {
                    key: "instructor",
                    label: "Instructor",
                    render: (row) => (
                        <div className="flex flex-col">
                            <span className="font-medium text-text-base">
                                {row.instructor
                                    ?.name ?? "--"}
                            </span>

                            <span className="text-xs text-text-secondary">
                                {row.instructor
                                    ?.email ?? "--"}
                            </span>
                        </div>
                    ),
                },

                {
                    key: "totalSessions",
                    label: "Total Sessions",
                    render: (row) =>
                        row.totalSessions ?? 0,
                },

                {
                    key: "totalPresents",
                    label: "My Presents",
                    render: (row) =>
                        row.totalPresents ?? 0,
                },

                {
                    key: "attendancePercentage",
                    label: "Attendance %",
                    render: (row) => (
                        <span
                            className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${row.attendancePercentage >=
                                    75
                                    ? "bg-success/15 text-success"
                                    : row.attendancePercentage >=
                                        50
                                        ? "bg-warning/15 text-warning"
                                        : "bg-error/15 text-error"
                                }
                            `}
                        >
                            {row.attendancePercentage}%
                        </span>
                    ),
                },

                {
                    key: "actions",
                    label: "Action",
                    render: (row) => (
                        <FormButton
                            type="button"
                            text="View Info"
                            Icon={Eye}
                            onClick={() =>
                                handleView(row)
                            }
                            className="
                                h-9!
                                px-4
                                text-sm
                                max-w-fit
                            "
                        />
                    ),
                },
            ],
            []
        );

    return (
        <>
            <SEO title="Attendance History | Attendix" description="Review past attendance records and historical session details." noindex />
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
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
                    flex
                    flex-col
                    md:flex-row
                    justify-between
                    gap-5
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
                            Attendance History
                        </h2>

                        <p
                            className="
                            text-sm
                            text-text-secondary
                            mt-1
                        "
                        >
                            View your subject-wise attendance summary and open detailed session records.
                        </p>
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />


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
                            onChange={setSearch}
                            placeholder="Search by subject name or code..."
                        />
                    </div>

                    <SelectBox
                        label="Sort"
                        option={sort}
                        setOption={setSort}
                        options={sortOptions}
                    />
                </div>

                {/* Table */}
                <div className="min-h-70">
                    <DataTable
                        columns={columns}
                        data={history}
                        loading={isLoading}
                        showCheckbox={false}
                    />
                </div>
            </motion.section>
        </>
    );
};

export default AttendanceHistory;