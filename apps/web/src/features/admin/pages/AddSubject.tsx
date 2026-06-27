import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import { subjectFields } from "@/features/subject/constants/subject.fields";
import { useCreateSubject } from "@/features/subject/hooks/useSubjectMutation";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import { statusOptions } from "@/shared/constants/filters";
import {
    subjectFormSchema,
    type SubjectFormInput,
    type CreateSubjectInput,
} from "@attendance/shared-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Combobox from "@/components/common/Combobox";

const AddSubject = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(subjectFormSchema),
        defaultValues: {
            status: statusOptions[1],
        },
    });

    const { mutate, isPending } = useCreateSubject();

    const { options: departmentOptions } = useDepartmentOptions();

    const getOptions = (fieldName: unknown) => {
        if (fieldName === "department") {
            return departmentOptions;
        }

        return [];
    };

    const onSubmit = (data: SubjectFormInput) => {
        const formattedData: CreateSubjectInput = {
            name: data.name,
            code: data.code,
            department: data.department.value,
            description: data.description,
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
                    Add Subject
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
                        {subjectFields.map((field) => {
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
    );
};

export default AddSubject;