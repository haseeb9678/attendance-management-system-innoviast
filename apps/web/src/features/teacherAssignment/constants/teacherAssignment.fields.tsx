import { statusOptions } from "@/shared/constants/filters";
import {
    UserRound,
    GraduationCap,
    BookOpen,
} from "lucide-react";

export const teacherAssignmentFields = [
    {
        id: 0,
        name: "department",
        label: "Department",
        placeholder: "Select Department",
        component: "select",
        Icon: UserRound,
        options: [],
        isApi: true,
    },
    {
        id: 1,
        name: "instructor",
        label: "Instructor",
        placeholder: "Select Instructor",
        component: "select",
        Icon: UserRound,
        options: [],
        isApi: true,
    },
    {
        id: 2,
        name: "class",
        label: "Class",
        placeholder: "Select class",
        component: "select",
        Icon: GraduationCap,
        options: [],
        isApi: true,
    },
    {
        id: 3,
        name: "subject",
        label: "Subject",
        placeholder: "Select subject",
        component: "select",
        Icon: BookOpen,
        options: [],
        isApi: true,
    },
    {
        id: 4,
        name: "status",
        label: "Status",
        component: "select",
        options: statusOptions.slice(1),
    },
];