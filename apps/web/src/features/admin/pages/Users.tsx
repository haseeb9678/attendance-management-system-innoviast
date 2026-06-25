import FormButton from '@/components/common/FormButton'
import SearchBox from '@/components/common/SearchBox'
import SelectBox from '@/components/common/SelectBox'
import DataTable from '@/components/common/Table'
import { userColumns } from '@/features/users/constants/userColumns'
import { roleOptions, statusOptions } from '@/shared/constants/userFilters'
import { LucidePlus, LucideUpload } from 'lucide-react'
import { useState } from 'react'

const Users = () => {
    const [role, setRole] = useState(roleOptions[0])
    const [status, setStatus] = useState(statusOptions[0])
    const [search, setSearch] = useState("")

    return (
        <section className="bg-white border border-gray-200 rounded-md
        flex flex-col gap-3
         shadow-sm flex-1 min-w-0">
            <div className='p-6 flex flex-col md:flex-row justify-between gap-5'>
                <h2 className='text-text-base text-2xl font-bold'>Users</h2>
                <div className='flex flex-col sm:flex-row items-center gap-3'>
                    <FormButton
                        type={"button"}
                        text={"Add User"}
                        className='min-w-max h-10! px-5 text-sm bg-success hover:bg-success-hover '
                        Icon={LucidePlus}
                    />
                    <FormButton
                        type={"button"}
                        text={"Export"}
                        className='min-w-max h-10! px-5 text-sm bg-warning hover:bg-warning-hover '
                        Icon={LucideUpload}
                    />
                </div>
            </div>
            <div className='border-t border-dashed border-gray-300' />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-6 py-4 border-b border-dashed border-gray-300">
                <div className="lg:col-span-2">
                    <SearchBox
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by name or email..."
                    />
                </div>

                <SelectBox
                    label="Role"
                    option={role}
                    setOption={setRole}
                    options={roleOptions}
                />

                <SelectBox
                    label="Status"
                    option={status}
                    setOption={setStatus}
                    options={statusOptions}
                />
            </div>

            <DataTable
                columns={userColumns}

            />

        </section>
    )
}

export default Users
