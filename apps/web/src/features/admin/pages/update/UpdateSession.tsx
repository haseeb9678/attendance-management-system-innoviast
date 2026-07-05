import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import Combobox from "@/components/common/Combobox";

import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { sessionFields } from "@/features/session/constants/session.fields";
import { useCreateSession, useUpdateSession } from "@/features/session/hooks/useSessionMutation";

import {
    sessionFormSchema,
    type SessionFormInput,
    type CreateSessionInput,
} from "@attendance/shared-zod";
import { useTeacherAssignmentOptions } from "@/features/teacherAssignment/hooks/useTeacherAssignmentOptions";
import { sessionStatusOptions } from "@/features/session/constants/filters";
import { useSession } from "@/features/session/hooks/useSession";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

const UpdateSession = () => {
    const navigate = useNavigate();
    const { id } = useParams()

    const { data, isPending: isSessionLoading, isError, error } = useSession(id as string)


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            status: sessionStatusOptions[1],
        },
    });

    const { mutate, isPending } =
        useUpdateSession();

    const {
        options: teacherAssignmentOptions,
    } = useTeacherAssignmentOptions();

    const getOptions = (fieldName: unknown) => {
        if (fieldName === "teacherAssignment") {
            return teacherAssignmentOptions;
        }

        return [];
    };


    const onSubmit = (
        data: SessionFormInput
    ) => {
        const formattedData: CreateSessionInput = {
            teacherAssignment:
                data.teacherAssignment.value,
            date: data.date,
            room: data.room,
            status: data.status.value as
                | "scheduled"
                | "ongoing"
                | "completed"
                | "cancelled",
            startTime: data.startTime,
            endTime: data.endTime,
        };

        mutate({
            id: id as string,
            body: formattedData
        }, {
            onSuccess: (res) => {
                toast.success(res.message);
                navigate(-1);
            },

            onError: (err) => {
                toast.error(err.message);
            },
        });
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
    if (!isSessionLoading && !isError && data?.status === "completed")
        return <section
            className="flex flex-col justify-center items-center gap-2 flex-1 text-text-secondary"
        >
            {"Session is completed, Unable to update"}
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
                    Update Session
                </h2>
            </div>

            <div className="border-t border-dashed border-border" />

            <div className="p-6">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-8"
                >
                    <div
                        className="
                            grid grid-cols-1 xl:grid-cols-2
                            gap-8
                        "
                    >
                        {sessionFields.map((field) => {
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
                                        label={
                                            field.name === "date" && data?.status === "ongoing"
                                                ? `${field.label} (Unable to update while session is ongoing)`
                                                : field.label
                                        }
                                        placeholder={field.placeholder}
                                        type={
                                            field.type as string
                                        }
                                        Icon={field.Icon}
                                        disabled={
                                            field.name ===
                                            "date" &&
                                            data?.status ===
                                            "ongoing"
                                        }
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
                                                disabled={
                                                    field.name === "teacherAssignment"

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
                            loadingText="Updating.."
                            isLoading={isPending}
                            className="max-w-50"
                        />
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateSession;