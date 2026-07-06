import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import { statusOptions } from "@/shared/constants/filters";
import {

    teacherAssignmentFormSchema,
    type TeacherAssignmentFormInput,
    type CreateTeacherAssignmentInput,
} from "@attendance/shared-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCreateTeacherAssignment, useUpdateTeacherAssignment } from "@/features/teacherAssignment/hooks/useTeacherAssignmentMutations";
import { teacherAssignmentFields } from "@/features/teacherAssignment/constants/teacherAssignment.fields";
import { useClassOptions } from "@/features/class/hooks/useClassOptions";
import { useSubjectOptions } from "@/features/subject/hooks/useSubjectOptions";
import { useUserOptions } from "@/features/users/hooks/useUserOptions";
import { useEffect } from "react";
import Combobox from "@/components/common/Combobox";
import { useTeacherAssignment } from "@/features/teacherAssignment/hooks/useTeacherAssignment";
import { Spinner } from "@/components/ui/spinner";
import { SEO } from '@/shared/components/SEO';

const UpdateTeacherAssignment = () => {
    const navigate = useNavigate();

    const { id } = useParams()

    const { data, isPending: isTeacherAssignmentLoading, isError, error } = useTeacherAssignment(id as string)


    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(teacherAssignmentFormSchema),
        defaultValues: {
            status: statusOptions[1],
        },
    });

    const { mutate, isPending } = useUpdateTeacherAssignment();

    const instructor = watch("instructor");
    const department = watch("department");



    const { options: departmentOptions } = useDepartmentOptions();

    const { options: classOptions } = useClassOptions({
        department: department?.value
    })

    const { options: subjectOptions } = useSubjectOptions({
        department: department?.value
    })
    const { options: instructorOptions } = useUserOptions({
        role: "instructor",
        department: department?.value,
    })

    const getOptions = (fieldName: unknown) => {
        if (fieldName === "department") {
            return departmentOptions;
        }
        if (fieldName === "class") {
            return classOptions;
        }
        if (fieldName === "subject") {
            return subjectOptions;
        }
        if (fieldName === "instructor") {
            return instructorOptions;
        }


        return [];
    };

    const onSubmit = (data: TeacherAssignmentFormInput) => {
        const formattedData: CreateTeacherAssignmentInput = {
            instructor: data.instructor.value,
            department: data.department.value,
            class: data.class.value,
            subject: data.subject.value,
            status: data.status.value as "active" | "inactive",
        };

        mutate({
            id: id as string,
            body: formattedData
        }, {
            onSuccess: (res) => {
                toast.success(res?.message);
                navigate(-1);
            },
            onError: (err) => {
                toast.error(err?.message);
            },
        });
    };

    console.log(classOptions, departmentOptions);


    const originalValue = (value: string, options) => options.find((item) => item.value === value)

    useEffect(() => {

        if (!id || !data || isTeacherAssignmentLoading)
            return

        reset(
            {
                ...data,
                department: originalValue(data?.department?._id, departmentOptions),
                class: originalValue(data?.class?._id, classOptions),
                subject: originalValue(data?.subject?._id, subjectOptions),
                instructor: originalValue(data?.instructor?._id, instructorOptions),
                status: originalValue(data?.status, statusOptions)
            }
        )

    }, [id, isTeacherAssignmentLoading,
        data, reset, departmentOptions,
        instructorOptions,
        classOptions, subjectOptions])

    if (isTeacherAssignmentLoading)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-primary-hover"
        >
            <Spinner className=" size-6" />
            Loading...
        </section>

    if (!isTeacherAssignmentLoading && isError)
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
        <>
            <SEO title="Update Teacher Assignment | Attendix" description="Update teacher assignment details in Attendix for accurate attendance tracking." noindex />

            <section
                className="bg-bg-card border border-border rounded-md
            flex flex-col gap-3 shadow-sm flex-1 min-w-0 h-max"
            >
                <div className="p-4 flex items-center gap-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="
                    p-2 backdrop-blur-lg rounded-full cursor-pointer relative
                    hover:bg-surface text-text-base transition-all duration-300"
                    >
                        <ArrowLeft
                            size={20}

                            className="cursor-pointer"
                        />
                    </button>

                    <h2 className="text-text-base text-2xl font-bold">
                        Update Assignemnt
                    </h2>
                </div>

                <div className="border-t border-dashed border-border" />

                <div className="p-6">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-8"
                    >
                        <div
                            className="grid grid-cols-1 xl:grid-cols-2
                        gap-8"
                        >
                            {teacherAssignmentFields.map((field) => {
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

                                if (field.component === "select") {
                                    return (

                                        <Controller
                                            key={field.id}
                                            control={control}
                                            name={field.name}
                                            render={({ field: controllerField }) => (
                                                <Combobox
                                                    showTopLabel
                                                    label={field.label}
                                                    option={controllerField.value}
                                                    setOption={controllerField.onChange}
                                                    options={
                                                        field.isApi
                                                            ? getOptions(field.name)
                                                            : field.options
                                                    }
                                                    error={
                                                        errors[field.name]?.message
                                                    }
                                                    className="h-12! rounded-3xl!"
                                                    disabled={
                                                        field.name === "department"
                                                    }
                                                />
                                            )}
                                        />
                                    );
                                }

                                return null;
                            })}
                        </div>

                        <div className="flex justify-end">
                            <FormButton
                                type="submit"
                                text="Update"
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

export default UpdateTeacherAssignment;