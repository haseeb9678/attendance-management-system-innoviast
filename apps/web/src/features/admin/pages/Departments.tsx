import FormButton from '@/components/common/FormButton'
import Pagination from '@/components/common/Pagination'
import SearchBox from '@/components/common/SearchBox'
import SelectBox from '@/components/common/SelectBox'
import DataTable from '@/components/common/Table'
import { departmentColumns } from '@/features/department/constants/departmentColumns'
import { useDepartments } from '@/features/department/hooks/useDepartment'
import { sortOptions, statusOptions } from '@/shared/constants/filters'
import useDebounce from '@/shared/hooks/useDebounce'
import { LucidePlus, LucideUpload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Departments = () => {

    const [status, setStatus] = useState(statusOptions[0])
    const [sort, setSort] = useState(sortOptions[0])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const debouncedSearch = useDebounce(search, 500)

    const navigate = useNavigate()

    const { data, isLoading } = useDepartments({
        search: debouncedSearch,
        status: status.value as "active" | "inactive",
        sort: sort.value as "oldest" | "newest",
        page,
        limit,

    })

    return (
        <section className="bg-bg-card border border-border rounded-md
        flex flex-col gap-3
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
                    <FormButton
                        type={"button"}
                        text={"Export"}
                        className='min-w-max h-10! px-5 text-sm bg-warning hover:bg-warning-hover '
                        Icon={LucideUpload}
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

            <DataTable
                columns={departmentColumns}
                data={data?.data}
                isLoading={isLoading}

            />

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
    )
}

export default Departments
