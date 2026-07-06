import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,

    LucideBookOpen,
    LucideCalendarCheck,
    LucideGraduationCap,
    LucideUpload,
    LucideUsers,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DataTable from "@/components/common/Table";
import EntriesSelect from "@/components/common/EnteriesSelect";
import FormButton from "@/components/common/FormButton";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";

import {
    limitOptions,
    sortOptions,
} from "@/shared/constants/filters";

import useDebounce from "@/shared/hooks/useDebounce";

import { useClassOverview } from "@/features/instructor/hooks/useInstructor";

import { classOverviewColumns } from "../constants/classColumns";
import { Spinner } from "@/components/ui/spinner";
import { SEO } from '@/shared/components/SEO';

const InstructorClassInfo = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [sort, setSort] =
        useState(sortOptions[0]);

    const [limit, setLimit] =
        useState(limitOptions[0]);

    const debouncedSearch =
        useDebounce(search, 500);

    /**
     * Reset page whenever filters change
     */
    useEffect(() => {
        setPage(1);
    }, [
        debouncedSearch,
        sort,
        limit,
    ]);

    const columns = useMemo(
        () => classOverviewColumns(),
        []
    );

    const {
        data,
        isPending,
    } = useClassOverview({
        classId: id as string,

        page,

        limit: Number(limit.value),

        search: debouncedSearch,

        sort:
            sort.value as
            | "newest"
            | "oldest",
    });

    const students =
        data?.data?.students ?? [];

    if (isPending)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-primary-hover"
        >
            <Spinner className=" size-6" />
            Loading...
        </section>

    if (!isPending && !data?.data)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-text-secondary"
        >
            Class not found.
        </section>

    return (
        <>
            <SEO title="Instructor Class Info | Attendix" description="Manage instructor class info in Attendix with attendance and academic workflows." noindex />
            <section
                className="
                bg-bg-card
                border border-border
                rounded-md
                shadow-sm
                flex flex-col
                gap-5
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
                    xl:flex-row
                    justify-between
                    gap-6
                "
                >


                    <div className="space-y-4">
                        <div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="
                            h-max w-max
                    p-2 backdrop-blur-lg rounded-full
                    cursor-pointer relative
                    hover:bg-surface
                    text-text-base
                    transition-all duration-300"
                                >
                                    <ArrowLeft
                                        size={20}

                                        className="cursor-pointer"
                                    />
                                </button>
                                <h2
                                    className="
                                text-2xl
                                font-bold
                                text-text-base
                            "
                                >
                                    {data?.data?.class?.name} Students
                                </h2>
                            </div>


                            <div
                                className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                                mt-2
                                text-sm
                                text-text-muted
                            "
                            >
                                <span>
                                    {data?.data?.class?.department?.name}
                                </span>

                                <span>•</span>

                                <span>
                                    Code:{" "}
                                    {data?.data?.class?.code}
                                </span>

                                <span>•</span>

                                <span className="capitalize">
                                    {data?.data?.class?.status}
                                </span>
                            </div>

                            {data?.data?.class?.description && (
                                <p
                                    className="
                                    mt-3
                                    text-sm
                                    text-text-muted
                                    max-w-3xl
                                "
                                >
                                    {
                                        data.data.class
                                            .description
                                    }
                                </p>
                            )}
                        </div>

                        {/* Subjects */}

                        <div className="flex flex-wrap gap-2">
                            {data?.data?.subjects?.map(
                                (subject: any) => (
                                    <div
                                        key={subject._id}
                                        className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-primary/20
                                        bg-primary/10
                                        px-3
                                        py-1.5
                                    "
                                    >
                                        <LucideBookOpen
                                            size={14}
                                            className="
                                            text-primary
                                        "
                                        />

                                        <span
                                            className="
                                            text-xs
                                            font-medium
                                            text-primary
                                        "
                                        >
                                            {subject.name}
                                        </span>

                                        <span
                                            className="
                                            text-[11px]
                                            text-primary/70
                                        "
                                        >
                                            ({subject.code})
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Actions */}

                    <div
                        className="
                        flex
                        flex-wrap
                        gap-3
                        h-max
                    "
                    >


                        <FormButton
                            type="button"
                            text="Attendance History"
                            Icon={LucideCalendarCheck}
                            className="
                            h-10!
                            px-5
                        "
                            onClick={() =>
                                navigate(
                                    `/instructor/attendance-history?class=${id}`
                                )
                            }
                        />
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />

                {/* Stats */}
                <div
                    className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                    px-6
                "
                >
                    {[
                        {
                            title: "Students",
                            value:
                                data?.data?.stats
                                    ?.totalStudents ?? 0,
                            Icon: LucideUsers,
                        },

                        {
                            title: "Subjects",
                            value:
                                data?.data?.stats
                                    ?.totalSubjects ?? 0,
                            Icon: LucideBookOpen,
                        },

                        {
                            title: "Sessions",
                            value:
                                data?.data?.stats
                                    ?.totalSessions ?? 0,
                            Icon: LucideCalendarCheck,
                        },

                        {
                            title: "Attendance",
                            value: `${data?.data?.stats?.averageAttendance ?? 0}%`,
                            Icon: LucideGraduationCap,
                        },
                    ].map(
                        (
                            item,
                            index
                        ) => (
                            <div
                                key={index}
                                className="
                                rounded-2xl
                                border
                                border-border
                                 bg-bg
                                p-5
                                flex
                                justify-between
                                items-center
                                transition-all
                                duration-200
                                hover:border-primary/30
                                hover:shadow-sm
                            "
                            >
                                <div>
                                    <p
                                        className="
                                        text-sm
                                        text-text-muted
                                    "
                                    >
                                        {item.title}
                                    </p>

                                    <h3
                                        className="
                                        mt-2
                                        text-3xl
                                        font-bold
                                        text-text-base
                                    "
                                    >
                                        {item.value}
                                    </h3>
                                </div>

                                <div
                                    className="
                                    h-12
                                    w-12
                                    rounded-full
                                    bg-primary/10
                                    flex
                                    items-center
                                    justify-center
                                "
                                >
                                    <item.Icon
                                        size={22}
                                        className="
                                        text-primary
                                    "
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="border-t border-dashed border-border" />

                {/* Filters */}
                <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-4
                    gap-4
                    p-6
                    pb-4
                "
                >
                    <div className="md:col-span-2">
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by student name, registration no, roll no..."
                        />
                    </div>

                    <SelectBox
                        label="Sort"
                        option={sort}
                        setOption={setSort}
                        options={sortOptions}
                    />

                    <EntriesSelect
                        value={limit}
                        onChange={setLimit}
                        options={limitOptions}
                    />
                </div>

                <div className="border-t border-dashed border-border" />

                {/* Students Table */}

                <div
                    className="
                    px-6
                    py-4
                "
                >
                    <DataTable
                        columns={columns}
                        data={students}
                        loading={isPending}
                        showCheckbox={false}
                        message="No students found for this class."
                    />
                </div>

                {/* Pagination */}

                <div className="px-6 pb-6">
                    {data?.meta && (
                        <Pagination
                            metaData={data.meta}
                            loading={isPending}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </section>
        </>
    );
};

export default InstructorClassInfo;