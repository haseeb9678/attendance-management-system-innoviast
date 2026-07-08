import { useEffect, useMemo, useState } from "react";
import { LucidePlus, X, Phone, User2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormButton from "@/components/common/FormButton";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import DataTable from "@/components/common/Table";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import Combobox from "@/components/common/Combobox";
import EntriesSelect from "@/components/common/EnteriesSelect";
import ExportButton from "@/components/common/ExportButton";
import FormInput from "@/components/common/FormInput";

import { getUserColumns } from "@/features/users/constants/userColumns";
import { useUsers } from "@/features/users/hooks/useUser";
import { useDeleteUser } from "@/features/users/hooks/useUserMutation";
import type { User } from "@/features/users/types/user.types";
import { userExportColumns } from "@/features/users/constants/userExportColumns";

import {
    limitOptions,
    roleOptions,
    sortOptions,
    statusOptions,
} from "@/shared/constants/filters";
import useDebounce from "@/shared/hooks/useDebounce";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import { SEO } from "@/shared/components/SEO";

import { useUpdateUser } from "../hooks/useAdminMutation";
import {
    adminUpdateUserFormSchema,
    adminUpdateUserSchema,
    type AdminUpdateUserFormInput,
    type AdminUpdateUserInput,
} from "@attendance/shared-zod";
import { useQueryClient } from "@tanstack/react-query";

const Users = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState(roleOptions[0]);
    const [status, setStatus] = useState(statusOptions[0]);
    const [department, setDepartment] = useState<
        { label: string; value: string } | undefined | null
    >(undefined);
    const [sort, setSort] = useState(sortOptions[0]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitOptions[0]);

    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [updateOpen, setUpdateOpen] =
        useState(false);

    const [selectedRowIds, setSelectedRowIds] =
        useState<string[]>([]);

    const debouncedSearch = useDebounce(
        search,
        500
    );

    const {
        data,
        isPending: isLoading,
    } = useUsers({
        search: debouncedSearch,
        role: role.value as
            | "admin"
            | "instructor"
            | "student",
        status: status.value as
            | "active"
            | "inactive",
        sort: sort.value as
            | "newest"
            | "oldest",
        department:
            department?.value as
            | string
            | undefined,
        page,
        limit: limit.value,
    });

    const {
        mutate,
        isPending: isDeleting,
    } = useDeleteUser();

    const {
        options: departmentOptions,
    } = useDepartmentOptions();

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
        setSelectedUser(user);
        setUpdateOpen(true);
    };

    const handleDeleteClick = (
        user: User
    ) => {
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
        });

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
        setDepartment(
            allDepartmentOptions[0]
        );
    }, [
        allDepartmentOptions,
        department,
    ]);

    useEffect(() => {
        setPage(1);
    }, [
        debouncedSearch,
        role,
        status,
        sort,
        department,
        limit,
    ]);

    return (
        <>
            <SEO
                title="Users | Attendix"
                description="Manage users in Attendix with attendance and academic workflows."
                noindex
            />

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
                            onClick={() =>
                                navigate("add")
                            }
                        />

                        <ExportButton
                            data={data?.data ?? []}
                            selectedRowIds={
                                selectedRowIds
                            }
                            getRowId={(user) =>
                                user._id
                            }
                            fileName="users"
                            columns={
                                userExportColumns
                            }
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
                        options={
                            allDepartmentOptions
                        }
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
                        getRowId={(row) =>
                            row._id
                        }
                        selectedRowIds={
                            selectedRowIds
                        }
                        onSelectedRowIdsChange={(
                            ids
                        ) =>
                            setSelectedRowIds(
                                ids as string[]
                            )
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
                    selectedUser
                        ? `Are you sure you want to delete "${selectedUser.name}"? This action cannot be undone.`
                        : "Are you sure you want to delete this user?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />

            <AnimatePresence>
                {updateOpen &&
                    selectedUser && (
                        <UpdateUserModal
                            user={selectedUser}
                            setIsOpen={
                                setUpdateOpen
                            }
                            onCloseComplete={() =>
                                setSelectedUser(
                                    null
                                )
                            }
                        />
                    )}
            </AnimatePresence>
        </>
    );
};

export default Users;

/* ---------------------------- */
/* Update User Modal */
/* ---------------------------- */

const UpdateUserModal = ({
    user,
    setIsOpen,
    onCloseComplete,
}: {
    user: User;
    setIsOpen: (open: boolean) => void;
    onCloseComplete?: () => void;
}) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<AdminUpdateUserFormInput>({
        resolver: zodResolver(
            adminUpdateUserFormSchema
        ),
    });

    const { mutate, isPending } =
        useUpdateUser();

    const selectedStatus = watch(
        "status"
    );

    console.log(errors);


    useEffect(() => {
        reset({
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber || "",
            status:
                statusOptions.find(
                    (option) =>
                        option.value === user.status
                ) ??
                {
                    label: "Active",
                    value: "active",
                },
        });
    }, [user, reset]);

    const queryClient = useQueryClient()

    const onSubmit = (
        values: AdminUpdateUserFormInput
    ) => {
        const formattedData: AdminUpdateUserInput = {
            id: values.id,
            name: values.name,
            phoneNumber: values.phoneNumber,
            status: values.status.value,
        };

        mutate(formattedData, {
            onSuccess: (res: any) => {
                toast.success(
                    res?.data?.message ||
                    "User updated successfully."
                );
                setIsOpen(false);
                onCloseComplete?.();
                queryClient.invalidateQueries({
                    queryKey: ['users']
                })

            },
            onError: (err: any) => {
                toast.error(
                    err?.message ||
                    "Failed to update user."
                );
            },
        });
    };

    return (
        <ModalShell
            title="Update User"
            description="Update user profile information and status."
            onClose={() => {
                setIsOpen(false);
                onCloseComplete?.();
            }}
        >
            <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(
                    onSubmit
                )}
            >
                <FormInput
                    register={register}
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Enter user name"
                    errors={errors}
                    Icon={User2Icon}
                />

                <FormInput
                    register={register}
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    placeholder="Enter phone number"
                    errors={errors}
                    Icon={Phone}
                />

                <div className="flex flex-col gap-2">

                    <Controller
                        control={control}
                        name="status"
                        render={({ field: controllerField }) => (
                            <Combobox
                                showTopLabel
                                label="Status"
                                option={controllerField.value}
                                setOption={controllerField.onChange}
                                options={statusOptions.slice(1)}
                                error={errors.status?.message}
                            />
                        )}
                    />

                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <FormButton
                        type="button"
                        text="Cancel"
                        className="bg-error text-white hover:bg-error-hover"
                        onClick={() => {
                            setIsOpen(false);
                            onCloseComplete?.();
                        }}
                    />

                    <FormButton
                        type="submit"
                        text="Update"
                        className="bg-success text-white hover:bg-success-hover"
                        disabled={isPending}
                        isLoading={isPending}
                        loadingText="Updating"
                    />
                </div>
            </form>
        </ModalShell>
    );
};

/* ---------------------------- */
/* Reusable Modal Shell */
/* ---------------------------- */

const ModalShell = ({
    title,
    description,
    children,
    onClose,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
    onClose: () => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
                bg-black/70 fixed inset-0 z-50
                flex items-center justify-center
                px-4
            "
            onClick={onClose}
        >
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeOut",
                }}
                onClick={(e) =>
                    e.stopPropagation()
                }
                className="
                    bg-bg-card border border-border rounded-2xl shadow-md p-5
                    w-11/12 sm:min-w-md max-w-xl
                    flex flex-col gap-8
                "
            >
                <div className="flex justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-text-base">
                            {title}
                        </h2>
                        <p className="text-sm text-text-muted">
                            {description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            h-10 w-10 rounded-xl
                            bg-surface text-text-base
                            flex items-center justify-center
                            hover:opacity-90 transition
                        "
                    >
                        <X size={22} />
                    </button>
                </div>

                {children}
            </motion.div>
        </motion.div>
    );
};