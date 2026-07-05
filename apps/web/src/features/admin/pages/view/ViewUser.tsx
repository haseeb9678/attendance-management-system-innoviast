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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import Combobox from "@/components/common/Combobox";
import { useUser } from "@/features/users/hooks/useUser";
import { Spinner } from "@/components/ui/spinner";

const ViewUser = () => {
    const navigate = useNavigate();

    const { id } = useParams()

    const { data, isPending: isUserLoading, isError, error } = useUser(id as string)


    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        reset
    } = useForm({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            role: roleOptions[1],
            status: statusOptions[1],
        },
    });



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
                        placeholder={field.label}
                        type={field.type as string}
                        Icon={field.Icon}
                        disabled={true}
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
                            disabled={true}
                        />
                    )}
                />
            );
        });

    useEffect(() => {
        if (!data) return;
        reset({
            ...data,
            status: originalValue(data.status, statusOptions),
            role: originalValue(data.role, roleOptions),
            department: originalValue(data?.department?._id, departmentOptions),
            class: originalValue(data?.class?._id, classOptions),
        });

    }, [data]
    )

    const originalValue = (value: string, options) => options.find((item) => item.value === value)


    if (isUserLoading)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-primary-hover"
        >
            <Spinner className=" size-6" />
            Loading...
        </section>

    if (!isUserLoading && isError)
        return <section
            className="flex flex-col justify-center items-center gap-2 flex-1 text-text-secondary"
        >
            {error?.message || "Something went wrong"}
            <FormButton
                type="button"
                text="Go Back"
                Icon={ArrowLeft}
                onClick={() =>
                    navigate(-1)
                }
                className="
                                h-9!
                                px-4
                                text-sm
                                max-w-fit
                            "
            />
        </section>
    return (
        <section
            className="bg-bg-card border border-border rounded-md
            flex flex-col gap-3 shadow-sm flex-1 min-w-0 h-max"
        >
            <div className="p-4 flex items-center gap-2">
                <div
                    onClick={() => navigate(-1)}
                    className="
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
                </div>

                <h2 className="text-text-base text-2xl font-bold">
                    User Info
                </h2>
            </div>

            <div className="border-t border-dashed border-border" />

            <div className="p-6">
                <form

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


                </form>
            </div>
        </section>
    );
};

export default ViewUser;

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

            </div>

            <div className="space-y-5 p-6">
                {children}
            </div>
        </section>
    );
};