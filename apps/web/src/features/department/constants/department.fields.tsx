import { statusOptions } from "@/shared/constants/filters";
import { Building2, FileText, Hash } from "lucide-react";

export const departmentFields = [
    {
        id: 1,
        name: "name",
        label: "Department Name",
        placeholder: "Enter department name",
        type: "text",
        component: "input",
        Icon: Building2,
    },
    {
        id: 2,
        name: "code",
        label: "Department Code",
        placeholder: "e.g. CS",
        type: "text",
        component: "input",
        Icon: Hash,
    },
    {
        id: 3,
        name: "description",
        label: "Description",
        placeholder: "Enter department description",
        type: "text",
        component: "input",
        Icon: FileText,
    },
    {
        id: 4,
        name: "status",
        label: "Status",
        component: "select",
        options: statusOptions.slice(1),
    },
];