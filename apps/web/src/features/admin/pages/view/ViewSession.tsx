import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import Combobox from "@/components/common/Combobox";

import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import { viewSessionFields } from "@/features/session/constants/session.fields";

import {
    sessionFormSchema,

} from "@attendance/shared-zod";
import { useTeacherAssignmentOptions } from "@/features/teacherAssignment/hooks/useTeacherAssignmentOptions";
import { sessionStatusOptions } from "@/features/session/constants/filters";
import { useSession } from "@/features/session/hooks/useSession";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

const ViewSession = () => {
    const navigate = useNavigate();
    const { id } = useParams()

    const { data, isPending: isSessionLoading, isError, error } = useSession(id as string)


    const {
        register,

        control,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            status: sessionStatusOptions[1],
        },
    });

    const {
        options: teacherAssignmentOptions,
    } = useTeacherAssignmentOptions();

    const getOptions = (fieldName: unknown) => {
        if (fieldName === "teacherAssignment") {
            return teacherAssignmentOptions;
        }

        return [];
    };



    const formatDateForInput = (date?: string | Date) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
    };

    const originalValue = (value: string, options) => options.find((item) => item.value === value)

    useEffect(() => {

        if (!id || !data || isSessionLoading)
            return

        reset(
            {
                ...data,
                date: formatDateForInput(data?.date),
                status: originalValue(data?.status, sessionStatusOptions),
                teacherAssignment: originalValue(data?.teacherAssignment?._id, teacherAssignmentOptions),
            }
        )

    }, [id, isSessionLoading,
        data, reset,
        teacherAssignmentOptions])


    if (isSessionLoading)
        return <section
            className="flex justify-center items-center gap-2 flex-1 text-primary-hover"
        >
            <Spinner className=" size-6" />
            Loading...
        </section>

    if (!isSessionLoading && isError)
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
            className="
                bg-bg-card border border-border rounded-md
                flex flex-col gap-3 shadow-sm flex-1 min-w-0 h-max
            "
        >
            <div className="p-4 flex items-center gap-2">
                <button
                    onClick={() => navigate(-1)}
                    className="
                        p-2 rounded-full cursor-pointer
                        hover:bg-surface transition-all text-text-base
                    "
                >
                    <ArrowLeft
                        size={20}

                    />
                </button>

                <h2 className="text-text-base text-2xl font-bold">
                    Session Info
                </h2>
            </div>

            <div className="border-t border-dashed border-border" />

            <div className="p-6">
                <form

                    className="flex flex-col gap-8"
                >
                    <div
                        className="
                            grid grid-cols-1 xl:grid-cols-2
                            gap-8
                        "
                    >
                        {viewSessionFields.map((field) => {
                            if (
                                field.component ===
                                "input"
                            ) {
                                return (
                                    <FormInput
                                        key={field.id}
                                        register={register}
                                        errors={errors}
                                        name={field.name}
                                        label={field.label
                                        }
                                        placeholder={field.placeholder}
                                        type={
                                            field.type as string
                                        }
                                        Icon={field.Icon}
                                        disabled={true}
                                    />
                                );
                            }

                            if (
                                field.component ===
                                "select"
                            ) {
                                return (
                                    <Controller
                                        key={field.id}
                                        control={control}
                                        name={field.name}
                                        render={({
                                            field:
                                            controllerField,
                                        }) => (
                                            <Combobox
                                                showTopLabel
                                                label={
                                                    field.label
                                                }
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
                                                    errors[
                                                        field
                                                            .name
                                                    ]
                                                        ?.message
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
    );
};

export default ViewSession;