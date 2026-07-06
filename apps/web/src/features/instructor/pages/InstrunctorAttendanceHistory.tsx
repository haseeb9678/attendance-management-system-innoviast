import { useEffect, useMemo, useState } from "react";
import { LucideUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FormButton from "@/components/common/FormButton";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import Combobox from "@/components/common/Combobox";
import EntriesSelect from "@/components/common/EnteriesSelect";
import DataTable from "@/components/common/Table";

import {
    attendanceStatusOptions,
    limitOptions,
    sortOptions,
} from "@/shared/constants/filters";

import useDebounce from "@/shared/hooks/useDebounce";

import { useAttendanceHistory, useAttendanceStats } from "@/features/attendance/hooks/useAttendance";
import { getAttendanceHistoryColumns } from "@/features/attendance/constants/attendanceHistoryColumns";

import { useClassOptions } from "@/features/class/hooks/useClassOptions";
import { useSubjectOptions } from "@/features/subject/hooks/useSubjectOptions";
import AttendanceStats from "@/features/attendance/components/AttendanceStats";
import { SEO } from '@/shared/components/SEO';

const InstructorAttendanceHistory = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState(
        attendanceStatusOptions[1]
    );

    const [sort, setSort] = useState(
        sortOptions[0]
    );

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [limit, setLimit] =
        useState(limitOptions[0]);

    const [selectedClass, setSelectedClass] =
        useState<
            | {
                label: string;
                value: string;
            }
            | undefined
            | null
        >(undefined);

    const [selectedSubject, setSelectedSubject] =
        useState<
            | {
                label: string;
                value: string;
            }
            | undefined
            | null
        >(undefined);

    const debouncedSearch =
        useDebounce(search, 500);

    const {
        data: stats,
        isPending: isStatsLoading,
    } = useAttendanceStats();


    /**
     * Attendance History
     */

    const {
        data,
        isPending: isLoading,
    } = useAttendanceHistory({
        page,
        limit: limit.value,

        search: debouncedSearch,

        class:
            selectedClass?.value || undefined,

        subject:
            selectedSubject?.value || undefined,

        status:
            status.value as
            | "marked"
            | "pending",

        sort:
            sort.value as
            | "newest"
            | "oldest",
    });

    /**
     * Filters
     */

    const {
        options: classOptions,
    } = useClassOptions();

    const {
        options: subjectOptions,
    } = useSubjectOptions();

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
            setSelectedClass(
                allClassOptions[0]
            );
        }

        if (!selectedSubject) {
            setSelectedSubject(
                allSubjectOptions[0]
            );
        }
    }, [
        allClassOptions,
        allSubjectOptions,
        selectedClass,
        selectedSubject,
    ]);

    /**
     * Actions
     */

    const handleView = (
        row: any
    ) => {
        navigate(
            `/instructor/sessions/${row._id}/attendance`
        );
    };

    const columns = useMemo(
        () =>
            getAttendanceHistoryColumns({
                onView: handleView,
            }),
        []
    );
    return (
        <>
            <SEO title="Instructor Attendance History | Attendix" description="Review past attendance records and historical session details." noindex />
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
                            View and manage attendance
                            records for your sessions.
                        </p>
                    </div>

                    <FormButton
                        type="button"
                        text="Export"
                        Icon={LucideUpload}
                        className="
                        max-w-40
                        h-10!
                        px-5
                        text-sm
                        bg-warning
                        hover:bg-warning-hover
                    "
                    />
                </div>

                <div className="border-t border-dashed border-border" />

                <AttendanceStats
                    stats={stats?.data}
                    loading={isStatsLoading}
                />

                {/* Filters */}

                <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-6
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
                            placeholder="Search by room..."
                        />
                    </div>

                    <SelectBox
                        label="Sort"
                        option={sort}
                        setOption={setSort}
                        options={sortOptions}
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
                        setOption={
                            setSelectedSubject
                        }
                        options={
                            allSubjectOptions
                        }
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
                        data={data?.data}
                        loading={isLoading}
                    />
                </div>

                {/* Pagination */}

                <div className="p-6">
                    {data?.meta && (
                        <Pagination
                            metaData={data.meta}
                            loading={isLoading}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </section>
        </>
    );
};

export default InstructorAttendanceHistory;