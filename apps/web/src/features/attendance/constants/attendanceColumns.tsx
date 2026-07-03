import { Controller } from "react-hook-form";

import type {
    Control,
    UseFormRegister,
} from "react-hook-form";

import type { TableColumn } from "@/components/common/Table";

import type { AttendanceFormInput } from "@attendance/shared-zod";

import { attendanceStatusOptions } from "@/shared/constants/filters";

import type { AttendanceTableRow } from "../types/attendance.types";
import Combobox from "@/components/common/Combobox";

export const attendanceColumns = ({
    control,
    register,
}: {
    control: Control<AttendanceFormInput>;
    register: UseFormRegister<AttendanceFormInput>;
}): TableColumn<AttendanceTableRow>[] => [
        {
            key: "rollNumber",
            label: "Roll #",
        },
        {
            key: "registrationNumber",
            label: "Registration #",
        },
        {
            key: "name",
            label: "Student",
        },
        {
            key: "status",
            label: "Attendance",

            render: (_, index) => (
                <Controller
                    control={control}
                    name={`students.${index}.status`}
                    render={({ field }) => (
                        <Combobox
                            label=""
                            options={attendanceStatusOptions}
                            option={
                                attendanceStatusOptions.find(
                                    (option) =>
                                        option.value ===
                                        field.value
                                ) ??
                                attendanceStatusOptions[0]
                            }
                            setOption={(option) =>
                                field.onChange(option.value)
                            }
                        />
                    )}
                />
            ),
        },
        {
            key: "remarks",
            label: "Remarks",

            render: (_, index) => (
                <input
                    type="text"
                    placeholder="Optional"
                    className="
                    w-full
                    rounded-md
                    border
                    border-border
                    bg-transparent
                    px-3
                    py-2
                    outline-none
                    focus:border-primary
                "
                    {...register(
                        `students.${index}.remarks`
                    )}
                />
            ),
        },
    ];