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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateTeacherAssignment } from "@/features/teacherAssignment/hooks/useTeacherAssignmentMutations";
import { teacherAssignmentFields } from "@/features/teacherAssignment/constants/teacherAssignment.fields";
import { useClassOptions } from "@/features/class/hooks/useClassOptions";
import { useSubjectOptions } from "@/features/subject/hooks/useSubjectOptions";
import { useUserOptions } from "@/features/users/hooks/useUserOptions";
import { useEffect } from "react";
import Combobox from "@/components/common/Combobox";
import { SEO } from '@/shared/components/SEO';

const AddTeacherAssignment = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(teacherAssignmentFormSchema),
        defaultValues: {
            status: statusOptions[1],
        },
    });

    const { mutate, isPending } = useCreateTeacherAssignment();

    const instructor = watch("instructor");
    const department = watch("department");



    const { options: departmentOptions } = useDepartmentOptions();

    const { options: classOptions } = useClassOptions({
        department: instructor?.department
    })
    const { options: subjectOptions } = useSubjectOptions({
        department: instructor?.department
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

    useEffect(() => {
        if (!department) return;

        setValue("class", undefined)
        setValue("subject", undefined)
        setValue("instructor", undefined)

    }, [department])

    useEffect(() => {
        if (!instructor) return;


        setValue("class", undefined)
        setValue("subject", undefined)

    }, [instructor])

    const onSubmit = (data: TeacherAssignmentFormInput) => {
        const formattedData: CreateTeacherAssignmentInput = {
            instructor: data.instructor.value,
            department: data.department.value,
            class: data.class.value,
            subject: data.subject.value,
            status: data.status.value as "active" | "inactive",
        };

        mutate(formattedData, {
            onSuccess: (res) => {
                toast.success(res?.message);
                navigate(-1);
            },
            onError: (err) => {
                toast.error(err?.message);
            },
        });
    };

    return (
        <>
            <SEO title="Add Teacher Assignment | Attendix" description="Add a new teacher assignment to Attendix for streamlined attendance and academic management." noindex />
            <section
                className="bg-bg-card border border-border rounded-md
            flex flex-col gap-3 shadow-sm flex-1 min-w-0 h-max"
            >
                <div className="p-4 flex items-center gap-2">
                    <div
                        className="
                    p-2 backdrop-blur-lg rounded-full cursor-pointer relative
                    hover:bg-surface text-text-base transition-all duration-300"
                    >
                        <ArrowLeft
                            size={20}
                            onClick={() => navigate(-1)}
                            className="cursor-pointer"
                        />
                    </div>

                    <h2 className="text-text-base text-2xl font-bold">
                        Add Assignemnt
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

export default AddTeacherAssignment;