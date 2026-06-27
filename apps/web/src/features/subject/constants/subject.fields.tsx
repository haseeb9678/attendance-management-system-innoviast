import { statusOptions } from "@/shared/constants/filters";
import {
    BookOpen,
    Building2,
    FileText,
    Hash,
} from "lucide-react";

export const subjectFields = [
    {
        id: 1,
        name: "name",
        label: "Subject Name",
        placeholder: "Enter subject name",
        type: "text",
        component: "input",
        Icon: BookOpen,
    },
    {
        id: 2,
        name: "code",
        label: "Subject Code",
        placeholder: "e.g. CS101",
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
        options: [], // Populate dynamically from API
        isApi: true,
    },
    {
        id: 4,
        name: "description",
        label: "Description",
        placeholder: "Enter subject description",
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