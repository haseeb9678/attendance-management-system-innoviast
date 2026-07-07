import Combobox from "@/components/common/Combobox";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import EntriesSelect from "@/components/common/EnteriesSelect";
import ExportButton from "@/components/common/ExportButton";
import FormButton from "@/components/common/FormButton";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import DataTable from "@/components/common/Table";
import { getClassColumns } from "@/features/class/constants/classColumns";
import { classExportColumns } from "@/features/class/constants/classExportColumns";
import { useClasses } from "@/features/class/hooks/useClass";
import { useDeleteClass } from "@/features/class/hooks/useClassMutation";
import type { Class } from "@/features/class/types/class.types";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import { limitOptions, sortOptions, statusOptions } from "@/shared/constants/filters";
import useDebounce from "@/shared/hooks/useDebounce";
import { LucidePlus, LucideUpload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SEO } from '@/shared/components/SEO';

const Classes = () => {
    const [status, setStatus] = useState(statusOptions[0]);
    const [sort, setSort] = useState(sortOptions[0]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitOptions[0]);
    const [department, setDepartment] = useState<{ label: string; value: string } | undefined | null>(undefined)

    const debouncedSearch = useDebounce(search, 500);

    const navigate = useNavigate();

    const { data, isPending: isLoading } = useClasses({
        search: debouncedSearch,
        status: status.value as "active" | "inactive",
        sort: sort.value as "oldest" | "newest",
        department: department?.value as string | undefined,
        page,
        limit: limit.value,
    });

    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
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

    const handleView = (seletedClassCol: Class) => {
        navigate(`${seletedClassCol._id}/info`);
    };

    const handleEdit = (seletedClassCol: Class) => {
        navigate(`${seletedClassCol._id}/update`);

    };

    const handleDeleteClick = (seletedClassCol: Class) => {
        setSelectedClass(seletedClassCol);
        setDeleteOpen(true);
    };

    const { mutate, isPending: isDeleting } = useDeleteClass()


    const handleDelete = () => {
        if (!selectedClass) return;


        mutate(selectedClass?._id, {
            onSuccess: (res) => {
                toast.success(res.message);
            },

            onError: (err) => {
                toast.error(err.message);
            },
        })

        setDeleteOpen(false);
        setSelectedClass(null);
    };

    const columns = useMemo(
        () =>
            getClassColumns({
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


    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, sort, department, limit]);


    return (
        <>
            <SEO title="Classes | Attendix" description="Manage classes in Attendix with attendance and academic workflows." noindex />


            <section
                className="bg-bg-card border border-border rounded-md
            flex flex-col gap-3 shadow-sm h-max flex-1 min-w-0"
            >
                <div className="p-6 flex flex-col md:flex-row justify-between gap-5">
                    <h2 className="text-text-base text-2xl font-bold">
                        Classes
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <FormButton
                            type="button"
                            text="Add Class"
                            className="min-w-max h-10! px-5 text-sm
                        bg-success hover:bg-success-hover"
                            Icon={LucidePlus}
                            onClick={() => navigate("add")}
                        />

                        <ExportButton
                            data={data?.data ?? []}
                            selectedRowIds={selectedRowIds}
                            getRowId={(row) => row._id}
                            fileName="classes"
                            columns={classExportColumns}
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
                            placeholder="Search classes by name or code..."
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

                <div
                    className="min-h-70"
                >
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
                    selectedClass
                        ? `Are you sure you want to delete "${selectedClass?.name}"? This action cannot be undone.`
                        : "Are you sure you want to delete this class?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />
        </>
    );
};

export default Classes;