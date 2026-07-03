import type { TableColumn } from "@/components/common/Table";
import type { ClassOverviewStudent } from "../types/instructor.types";


export const classOverviewColumns =
    (): TableColumn<ClassOverviewStudent>[] => [
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
            key: "email",
            label: "Email Address",
        },

        {
            key: "phoneNumber",
            label: "Phone Number",

            render: (row) =>
                row.phoneNumber || "-",
        },
    ];