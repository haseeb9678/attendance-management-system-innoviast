import { useMemo, useState } from "react";
import { LucidePlus, LucideUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import FormButton from "@/components/common/FormButton";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import EntriesSelect from "@/components/common/EnteriesSelect";
import DataTable from "@/components/common/Table";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

import {
    limitOptions,
    sortOptions,

} from "@/shared/constants/filters";
import useDebounce from "@/shared/hooks/useDebounce";

import { useSessions } from "@/features/session/hooks/useSession";
import { useDeleteSession } from "@/features/session/hooks/useSessionMutation";
import type { Session } from "@/features/session/types/session.types";
import { getSessionColumns } from "@/features/session/constants/sessionColumns";
import { sessionStatusOptions } from "@/features/session/constants/filters";
import ExportButton from "@/components/common/ExportButton";
import { sessionExportColumns } from "@/features/session/constants/sessionExportColumns";
import { SEO } from '@/shared/components/SEO';

const Sessions = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState(sessionStatusOptions[0]);
    const [sort, setSort] = useState(sortOptions[0]);
    const [limit, setLimit] = useState(limitOptions[0]);


    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [selectedSession, setSelectedSession] =
        useState<Session | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 500);


    const { data, isPending: isLoading } = useSessions({
        page,
        limit: limit.value,
        search: debouncedSearch,

        status: status.value as any,
        sort: sort.value as "newest" | "oldest",
    });

    const { mutate, isPending: isDeleting } =
        useDeleteSession();

    const handleView = (session: Session) =>
        navigate(`${session._id}/info`);

    const handleEdit = (session: Session) =>
        navigate(`${session._id}/update`);

    const handleDeleteClick = (session: Session) => {
        setSelectedSession(session);
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!selectedSession) return;

        mutate(selectedSession._id, {
            onSuccess: (res) => {
                toast.success(res.message);
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });

        setDeleteOpen(false);
        setSelectedSession(null);
    };
    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

    const columns = useMemo(
        () =>
            getSessionColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDeleteClick,
            }),
        []
    );

    return (
        <>
            <SEO title="Sessions | Attendix" description="Track your sessions, schedules, and attendance details in Attendix." noindex />
            <section
                className="
                    bg-bg-card border border-border rounded-md
                    flex flex-col gap-3 shadow-sm flex-1 min-w-0 h-max
                "
            >
                <div className="p-6 flex flex-col md:flex-row justify-between gap-5">
                    <h2 className="text-text-base text-2xl font-bold">
                        Sessions
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <FormButton
                            type="button"
                            text="Add Session"
                            Icon={LucidePlus}
                            className="
                                min-w-max h-10! px-5 text-sm
                                bg-success hover:bg-success-hover
                            "
                            onClick={() => navigate("add")}
                        />

                        <ExportButton
                            data={data?.data ?? []}
                            selectedRowIds={selectedRowIds}
                            getRowId={(row) => row._id}
                            fileName="sessions"
                            columns={sessionExportColumns}
                        />
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />

                <div
                    className="
                        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
                        gap-3 p-6 py-4
                        border-b border-dashed border-border
                    "
                >
                    <div className="lg:col-span-2">
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search room..."
                        />
                    </div>

                    <SelectBox
                        label="Status"
                        option={status}
                        setOption={setStatus}
                        options={sessionStatusOptions}
                    />

                    <SelectBox
                        label="Sort"
                        option={sort}
                        setOption={setSort}
                        options={sortOptions}
                    />


                </div>

                <div className="px-6 py-3">
                    <EntriesSelect
                        value={limit}
                        onChange={setLimit}
                        options={limitOptions}
                    />
                </div>

                <div className="min-h-70">
                    <DataTable
                        columns={columns}
                        data={data?.data}
                        loading={isLoading}
                        getRowId={(row) => row._id}
                        selectedRowIds={selectedRowIds}
                        onSelectedRowIdsChange={(ids) =>
                            setSelectedRowIds(ids as string[])
                        }
                    />
                </div>

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

            <ConfirmationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                loading={isDeleting}
                variant="danger"
                title="Delete Session?"
                description={
                    selectedSession
                        ? `Are you sure you want to delete this session?`
                        : "Are you sure you want to delete this session?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />
        </>
    );
};

export default Sessions;