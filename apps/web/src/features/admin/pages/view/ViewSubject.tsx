import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import { subjectFields } from "@/features/subject/constants/subject.fields";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import { statusOptions } from "@/shared/constants/filters";
import {
    subjectFormSchema,

} from "@attendance/shared-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Combobox from "@/components/common/Combobox";
import { useSubject } from "@/features/subject/hooks/useSubject";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { SEO } from '@/shared/components/SEO';

const ViewSubject = () => {
    const navigate = useNavigate();

    const { id } = useParams()

    const { data, isPending: isSubjectLoading, isError, error } = useSubject(id as string)


    const {
        register,

        formState: { errors },
        control,
        reset,
    } = useForm({
        resolver: zodResolver(subjectFormSchema),
        defaultValues: {
            status: statusOptions[1],
        },
    });



    const { options: departmentOptions } = useDepartmentOptions();

    const getOptions = (fieldName: unknown) => {
        if (fieldName === "department") {
            return departmentOptions;
        }

        return [];
    };

    const originalValue = (value: string, options) => options.find((item) => item.value === value)

    useEffect(() => {

        if (!id || !data || isSubjectLoading)
            return

        reset(
            {
                ...data,
                status: originalValue(data?.status, statusOptions),
                department: originalValue(data?.department?._id, departmentOptions)
            }
        )

    }, [id, isSubjectLoading, data, reset, departmentOptions])

    if (isSubjectLoading)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-primary-hover"
        >
            <Spinner className=" size-6" />
            Loading...
        </section>

    if (!isSubjectLoading && isError)
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

            <SEO title="View Subject | Attendix" description="Review subject details within Attendix." noindex />
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
                        Subject Info
                    </h2>
                </div>

                <div className="border-t border-dashed border-border" />

                <div className="p-6">
                    <form

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
                                            disabled={true}
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
                                                    disabled={true}
                                                />
                                            )}
                                        />
                                    );
                                }

                                return null;
                            })}
                        </div>


                    </form>
                </div>
            </section>
        </>
    );
};

export default ViewSubject;