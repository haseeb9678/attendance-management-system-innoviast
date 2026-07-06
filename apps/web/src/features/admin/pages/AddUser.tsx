import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import SelectBox from "@/components/common/SelectBox";

import {
    divisions,
    formFields,
    instructorFields,
    studentFields,
} from "@/features/users/constants/user.fields";

import { useCreateUser } from "@/features/users/hooks/useUserMutation";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import { useClassOptions } from "@/features/class/hooks/useClassOptions";

import {
    roleOptions,
    statusOptions,
} from "@/shared/constants/filters";

import {
    userFormSchema,
    type UserFormInput,
    type CreateUserInput,
} from "@attendance/shared-zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import Combobox from "@/components/common/Combobox";
import { SEO } from '@/shared/components/SEO';

const AddUser = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue
    } = useForm({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            role: roleOptions[1],
            status: statusOptions[1],
        },
    });

    const { mutate, isPending } = useCreateUser();

    const { options: departmentOptions } =
        useDepartmentOptions();

    const department = watch("department");


    const { options: classOptions } =
        useClassOptions({
            department: department?.value,
        });

    const role = watch("role")?.value;

    const roleFields = {
        student: {
            title: "Student Information",
            fields: studentFields,
        },
        instructor: {
            title: "Instructor Information",
            fields: instructorFields,
        },
    };

    const currentRole =
        roleFields[
        role as keyof typeof roleFields
        ];

    const getOptions = (fieldName: unknown) => {
        switch (fieldName) {
            case "department":
                return departmentOptions;

            case "class":
                return classOptions;

            default:
                return [];
        }
    };

    const renderFields = (
        fields: typeof formFields
    ) =>
        fields.map((field) => {
            if (field.component === "input") {
                return (
                    <FormInput
                        key={field.id}
                        register={register}
                        errors={errors}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        type={field.type as string}
                        Icon={field.Icon}
                    />
                );
            }

            return (
                <Controller
                    key={field.id}
                    control={control}
                    name={field.name}
                    render={({
                        field: controllerField,
                    }) => (
                        <Combobox
                            showTopLabel
                            label={field.label}
                            option={
                                controllerField.value
                            }
                            setOption={
                                controllerField.onChange
                            }
                            options={
                                field.isApi
                                    ? getOptions(
                                        field.name
                                    )
                                    : field.options
                            }
                            error={
                                errors[field.name]
                                    ?.message
                            }
                            className="h-12! rounded-3xl!"
                        />
                    )}
                />
            );
        });

    const onSubmit = (
        data: UserFormInput
    ) => {
        const formattedData: CreateUserInput = {
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password,

            role: data.role.value as
                | "admin"
                | "student"
                | "instructor",

            status: data.status.value as
                | "active"
                | "inactive",

            registrationNumber:
                data.registrationNumber,

            rollNumber: data.rollNumber,

            employeeId: data.employeeId,

            department:
                data.department?.value,

            class:
                data.class?.value,
        };

        mutate(formattedData, {
            onSuccess: (res) => {
                toast.success(res.message);
                navigate(-1);
            },

            onError: (err) => {
                toast.error(err.message);
            },
        });
    };

    useEffect(() => {
        if (!department) return;

        setValue("class", undefined)
    }, [department])

    return (
        <>
            <SEO title="Add User | Attendix" description="Add a new user to Attendix for streamlined attendance and academic management." noindex />
            <section
                className="bg-bg-card border border-border rounded-md
            flex flex-col gap-3 shadow-sm flex-1 min-w-0 h-max"
            >
                <div className="p-4 flex items-center gap-2">
                    <div
                        className="
                    p-2 backdrop-blur-lg rounded-full
                    cursor-pointer relative
                    hover:bg-surface
                    text-text-base
                    transition-all duration-300"
                    >
                        <ArrowLeft
                            size={20}
                            onClick={() => navigate(-1)}
                            className="cursor-pointer"
                        />
                    </div>

                    <h2 className="text-text-base text-2xl font-bold">
                        Add User
                    </h2>
                </div>

                <div className="border-t border-dashed border-border" />

                <div className="p-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-8"
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {divisions.map((division) => (
                                <ParentBox
                                    key={division.id}
                                    label={division.label}
                                >
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                        {renderFields(
                                            formFields.filter(
                                                (field) =>
                                                    field.division ===
                                                    division.division
                                            )
                                        )}
                                    </div>
                                </ParentBox>
                            ))}

                            {currentRole && (
                                <ParentBox
                                    label={currentRole.title}
                                >
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                        {renderFields(
                                            currentRole.fields
                                        )}
                                    </div>
                                </ParentBox>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <FormButton
                                type="submit"
                                text="Add"
                                isLoading={isPending}
                                className="max-w-50"
                            />
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default AddUser;

interface ParentBoxProps {
    label: string;
    children: React.ReactNode;
}

const ParentBox = ({
    label,
    children,
}: ParentBoxProps) => {
    return (

        <section
            className="
            overflow-hidden
            rounded-xl
            border border-border
            bg-bg-card
            shadow-sm"
        >
            <div className="h-1 w-full bg-primary" />

            <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-text-base">
                    {label}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                    Fill in the required information below.
                </p>
            </div>

            <div className="space-y-5 p-6">
                {children}
            </div>
        </section>
    );
};