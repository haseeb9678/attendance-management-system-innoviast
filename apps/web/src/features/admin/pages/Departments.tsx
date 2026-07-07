import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import EntriesSelect from '@/components/common/EnteriesSelect'
import ExportButton from '@/components/common/ExportButton'
import FormButton from '@/components/common/FormButton'
import Pagination from '@/components/common/Pagination'
import SearchBox from '@/components/common/SearchBox'
import SelectBox from '@/components/common/SelectBox'
import DataTable from '@/components/common/Table'
import { getDepartmentColumns } from '@/features/department/constants/departmentColumns'
import { departmentExportColumns } from '@/features/department/constants/departmentExportColumns'
import { useDepartments } from '@/features/department/hooks/useDepartment'
import { useDeleteDepartment } from '@/features/department/hooks/useDepartmentMutation'
import type { Department } from '@/features/department/types/department.types'
import { limitOptions, sortOptions, statusOptions } from '@/shared/constants/filters'
import useDebounce from '@/shared/hooks/useDebounce'
import { LucidePlus, LucideUpload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { SEO } from '@/shared/components/SEO';

const Departments = () => {

    const [status, setStatus] = useState(statusOptions[0])
    const [sort, setSort] = useState(sortOptions[0])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(limitOptions[0])


    const [selectedDepart, setSelectedDepart] = useState<Department | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 500)

    const navigate = useNavigate()

    const { data, isPending: isLoading } = useDepartments({
        search: debouncedSearch,
        status: status.value as "active" | "inactive",
        sort: sort.value as "oldest" | "newest",
        page,
        limit: limit.value,

    })

    const handleView = (depart: Department) => {
        navigate(`${depart._id}/info`)
    };

    const handleEdit = (depart: Department) => {
        navigate(`${depart._id}/update`)
    };

    const handleDeleteClick = (depart: Department) => {
        setSelectedDepart(depart);
        setDeleteOpen(true);
    };

    const { mutate, isPending: isDeleting } = useDeleteDepartment()


    const handleDelete = () => {
        if (!selectedDepart) return;


        mutate(selectedDepart._id, {
            onSuccess: (res) => {
                toast.success(res.message);
            },

            onError: (err) => {
                toast.error(err.message);
            },
        })

        setDeleteOpen(false);
        setSelectedDepart(null);
    };

    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);


    const columns = useMemo(
        () =>
            getDepartmentColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDeleteClick,
            }),
        []
    );


    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, sort, limit]);


    return (
        <>
            <SEO title="Departments | Attendix" description="Manage departments in Attendix with attendance and academic workflows." noindex />
            <section className="bg-bg-card border border-border rounded-md
        flex flex-col gap-3 h-max
         shadow-sm flex-1 min-w-0">
                <div className='p-6 flex flex-col md:flex-row justify-between gap-5'>
                    <h2 className='text-text-base text-2xl font-bold'>Departments</h2>
                    <div className='flex flex-col sm:flex-row items-center gap-3'>
                        <FormButton
                            type={"button"}
                            text={"Add Department"}
                            className='min-w-max h-10! px-5 text-sm
                         bg-success hover:bg-success-hover '
                            Icon={LucidePlus}
                            onClick={() => navigate("add")}
                        />
                        <ExportButton
                            data={data?.data ?? []}
                            selectedRowIds={selectedRowIds}
                            getRowId={(row) => row._id}
                            fileName="departments"
                            columns={departmentExportColumns}
                        />
                    </div>
                </div>
                <div className='border-t border-dashed border-border' />
                <div className="grid grid-cols-1 md:grid-cols-2
             lg:grid-cols-4 gap-3 p-6 py-4 border-b border-dashed
              border-border">
                    <div className="lg:col-span-2">
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search departments by name or code..."
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



                <div className=" p-6">
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
                    selectedDepart
                        ? `Are you sure you want to delete "${selectedDepart?.name}"? This action cannot be undone.`
                        : "Are you sure you want to delete this department?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />
        </>
    )
}

export default Departments
