import { statusOptions } from "@/shared/constants/filters";
import {
    BookOpen,
    Building2,
    FileText,
    Hash,
} from "lucide-react";

export const classFields = [
    {
        id: 1,
        name: "name",
        label: "Class Name",
        placeholder: "Enter class name",
        type: "text",
        component: "input",
        Icon: BookOpen,
    },
    {
        id: 2,
        name: "code",
        label: "Class Code",
        placeholder: "e.g. BSCS-A",
        type: "text",
        component: "input",
        Icon: Hash,
    },
    {
        id: 3,
        name: "department",
        label: "Department",
        placeholder: "Select department",
        component: "select",
        Icon: Building2,
        options: [], // Populate from API
    },
    {
        id: 4,
        name: "description",
        label: "Description",
        placeholder: "Enter class description",
        type: "text",
        component: "input",
        Icon: FileText,
    },
    {
        id: 5,
        name: "status",
        label: "Status",
        component: "select",
        options: statusOptions.slice(1),
    },
];