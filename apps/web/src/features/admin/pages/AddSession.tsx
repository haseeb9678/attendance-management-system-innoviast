import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import Combobox from "@/components/common/Combobox";

import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { sessionFields } from "@/features/session/constants/session.fields";
import { useCreateSession } from "@/features/session/hooks/useSessionMutation";

import {
    sessionFormSchema,
    type SessionFormInput,
    type CreateSessionInput,
} from "@attendance/shared-zod";
import { useTeacherAssignmentOptions } from "@/features/teacherAssignment/hooks/useTeacherAssignmentOptions";
import { sessionStatusOptions } from "@/features/session/constants/filters";

const AddSession = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            status: sessionStatusOptions[1],
        },
    });

    const { mutate, isPending } =
        useCreateSession();

    const {
        options: teacherAssignmentOptions,
    } = useTeacherAssignmentOptions();

    const getOptions = (fieldName: unknown) => {
        if (fieldName === "teacherAssignment") {
            return teacherAssignmentOptions;
        }

        return [];
    };

    console.log(teacherAssignmentOptions);


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

    return (
        <section
            className="
                bg-bg-card border border-border rounded-md
                flex flex-col gap-3 shadow-sm flex-1 min-w-0 h-max
            "
        >
            <div className="p-4 flex items-center gap-2">
                <div
                    className="
                        p-2 rounded-full cursor-pointer
                        hover:bg-surface transition-all text-text-base
                    "
                >
                    <ArrowLeft
                        size={20}
                        onClick={() => navigate(-1)}
                    />
                </div>

                <h2 className="text-text-base text-2xl font-bold">
                    Add Session
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
                                        label={field.label}
                                        placeholder={
                                            field.placeholder
                                        }
                                        type={
                                            field.type as string
                                        }
                                        Icon={field.Icon}
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

export default AddSession;