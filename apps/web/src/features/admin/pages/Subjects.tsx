import Combobox from "@/components/common/Combobox";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import EntriesSelect from "@/components/common/EnteriesSelect";
import ExportButton from "@/components/common/ExportButton";
import FormButton from "@/components/common/FormButton";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import DataTable from "@/components/common/Table";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import { getSubjectColumns } from "@/features/subject/constants/subjectColumns";
import { subjectExportColumns } from "@/features/subject/constants/subjectExportColumns";
import { useSubjects } from "@/features/subject/hooks/useSubject";
import { useDeleteSubject } from "@/features/subject/hooks/useSubjectMutation";
import type { Subject } from "@/features/subject/types/subject.types";
import { limitOptions, sortOptions, statusOptions } from "@/shared/constants/filters";
import useDebounce from "@/shared/hooks/useDebounce";
import { LucidePlus, LucideUpload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Subjects = () => {
    const [status, setStatus] = useState(statusOptions[0]);
    const [sort, setSort] = useState(sortOptions[0]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitOptions[0]);
    const [department, setDepartment] = useState<{ label: string; value: string } | undefined | null>(undefined)


    const debouncedSearch = useDebounce(search, 500);

    const navigate = useNavigate();

    const { data, isPending: isLoading } = useSubjects({
        search: debouncedSearch,
        status: status.value as "active" | "inactive",
        sort: sort.value as "oldest" | "newest",
        department: department?.value as string | undefined,
        page,
        limit: limit.value,
    });

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { options: departmentOptions, isLoading: isDepartmentLoading } = useDepartmentOptions()
    const allDepartmentOptions = useMemo(
        () => [
            {
                label: "All Departments",
                value: "",
            },
            ...(departmentOptions ?? []),
        ],
        [departmentOptions]
    );

    const handleView = (subject: Subject) => {
        navigate(`${subject._id}/info`);
    };

    const handleEdit = (subject: Subject) => {
        navigate(`${subject._id}/update`);
    };

    const handleDeleteClick = (subject: Subject) => {
        setSelectedSubject(subject);
        setDeleteOpen(true);
    };

    const { mutate, isPending: isDeleting } = useDeleteSubject()


    const handleDelete = () => {
        if (!selectedSubject) return;


        mutate(selectedSubject._id, {
            onSuccess: (res) => {
                toast.success(res.message);
            },

            onError: (err) => {
                toast.error(err.message);
            },
        })

        setDeleteOpen(false);
        setSelectedSubject(null);
    };

    const columns = useMemo(
        () =>
            getSubjectColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDeleteClick,
            }),
        []
    );


    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

    useEffect(() => {
        if (department) return;

        setDepartment(allDepartmentOptions[0]);
    }, [allDepartmentOptions, department]);


    return (
        <>
            <section
                className="bg-bg-card border border-border rounded-md
            flex flex-col gap-3 shadow-sm flex-1
            h-max
            min-w-0"
            >
                <div className="p-6 flex flex-col md:flex-row justify-between gap-5">
                    <h2 className="text-text-base text-2xl font-bold">
                        Subjects
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <FormButton
                            type="button"
                            text="Add Subject"
                            className="min-w-max h-10! px-5 text-sm
                        bg-success hover:bg-success-hover"
                            Icon={LucidePlus}
                            onClick={() => navigate("add")}
                        />

                        <ExportButton
                            data={data?.data ?? []}
                            selectedRowIds={selectedRowIds}
                            getRowId={(subject) => subject._id}
                            fileName="subjects"
                            columns={subjectExportColumns}
                        />
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />

                <div
                    className="grid grid-cols-1 md:grid-cols-2
                lg:grid-cols-5 gap-3 p-6 py-4
                border-b border-dashed border-border"
                >
                    <div className="lg:col-span-2">
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search subjects by name or code..."
                        />
                    </div>

                    <SelectBox
                        label="Status"
                        option={status}
                        setOption={setStatus}
                        options={statusOptions}
                    />

                    <SelectBox
                        label="Sort"
                        option={sort}
                        setOption={setSort}
                        options={sortOptions}
                    />
                    <Combobox
                        label="Department"
                        option={department}
                        setOption={setDepartment}
                        options={allDepartmentOptions}
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
                title="Delete User?"
                description={
                    selectedSubject
                        ? `Are you sure you want to delete "${selectedSubject?.name + " (" + selectedSubject?.department?.name + ")"}"? This action cannot be undone.`
                        : "Are you sure you want to delete this subject?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />
        </>
    );
};

export default Subjects;