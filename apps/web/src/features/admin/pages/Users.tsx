import { useEffect, useMemo, useState } from "react";
import { LucidePlus, LucideUpload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FormButton from "@/components/common/FormButton";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import DataTable from "@/components/common/Table";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

import { getUserColumns } from "@/features/users/constants/userColumns";
import { useUsers } from "@/features/users/hooks/useUser";
import type { User } from "@/features/users/types/user.types";

import {
    limitOptions,
    roleOptions,
    sortOptions,
    statusOptions,
} from "@/shared/constants/filters";
import useDebounce from "@/shared/hooks/useDebounce";
import { useDeleteUser } from "@/features/users/hooks/useUserMutation";
import { toast } from "sonner";
import Combobox from "@/components/common/Combobox";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import EntriesSelect from "@/components/common/EnteriesSelect";

const Users = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState(roleOptions[0]);
    const [status, setStatus] = useState(statusOptions[0]);
    const [department, setDepartment] = useState<{ label: string; value: string } | undefined | null>(undefined)
    const [sort, setSort] = useState(sortOptions[0]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitOptions[0]);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isPending: isLoading } = useUsers({
        search: debouncedSearch,
        role: role.value as "admin" | "instructor" | "student",
        status: status.value as "active" | "inactive",
        sort: sort.value as "newest" | "oldest",
        department: department?.value as string | undefined,
        page,
        limit: limit.value,
    });

    const { mutate, isPending: isDeleting } = useDeleteUser()
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

    const handleView = (user: User) => {
        navigate(`${user._id}/info`);
    };

    const handleEdit = (user: User) => {
        navigate(`edit/${user._id}`);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!selectedUser) return;


        mutate(selectedUser._id, {
            onSuccess: (res) => {
                toast.success(res.message);
            },

            onError: (err) => {
                toast.error(err.message);
            },
        })

        setDeleteOpen(false);
        setSelectedUser(null);
    };

    const columns = useMemo(
        () =>
            getUserColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDeleteClick,
            }),
        []
    );

    useEffect(() => {
        if (department) return;

        setDepartment(allDepartmentOptions[0]);
    }, [allDepartmentOptions, department]);

    return (
        <>
            <section
                className="
                    bg-bg-card border border-border rounded-md
                    flex flex-col gap-3 shadow-sm flex-1 min-w-0 h-max
                "
            >
                <div className="p-6 flex flex-col md:flex-row justify-between gap-5">
                    <h2 className="text-text-base text-2xl font-bold">
                        Users
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <FormButton
                            type="button"
                            text="Add User"
                            Icon={LucidePlus}

                            className="
                                min-w-max h-10! px-5 text-sm
                                bg-success hover:bg-success-hover
                            "
                            onClick={() => navigate("add")}
                        />

                        <FormButton
                            type="button"
                            text="Export"
                            Icon={LucideUpload}
                            className="
                                min-w-max h-10! px-5 text-sm
                                bg-warning hover:bg-warning-hover
                            "
                        />
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />

                <div
                    className="
                        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6
                        gap-3 p-6 py-4
                        border-b border-dashed border-border
                    "
                >
                    <div className="lg:col-span-2">
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search users by name, email or ID..."
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
                    selectedUser
                        ? `Are you sure you want to delete "${selectedUser.name}"? This action cannot be undone.`
                        : "Are you sure you want to delete this user?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />
        </>
    );
};

export default Users;