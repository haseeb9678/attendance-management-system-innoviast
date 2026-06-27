
import {
    Calendar,
    Clock3,
    DoorOpen,
    UserCheck,
} from "lucide-react";
import { sessionStatusOptions } from "./filters";

export const sessionFields = [
    {
        id: 1,
        name: "teacherAssignment",
        label: "Teacher Assignment",
        placeholder: "Select teacher assignment",
        component: "select",
        Icon: UserCheck,
        options: [],
        isApi: true,
    },
    {
        id: 2,
        name: "date",
        label: "Session Date",
        type: "date",
        component: "input",
        Icon: Calendar,
    },
    {
        id: 3,
        name: "startTime",
        label: "Start Time",
        type: "time",
        component: "input",
        Icon: Clock3,
    },
    {
        id: 4,
        name: "endTime",
        label: "End Time",
        type: "time",
        component: "input",
        Icon: Clock3,
    },
    {
        id: 5,
        name: "room",
        label: "Room",
        placeholder: "e.g. Lab 1 / Room A-201",
        type: "text",
        component: "input",
        Icon: DoorOpen,
    },
    {
        id: 6,
        name: "status",
        label: "Status",
        component: "select",
        options: sessionStatusOptions.slice(1),
    },
];