import {

    Hash,

    Lock, Mail, Phone, UserCheck2Icon
} from "lucide-react";

import { roleOptions, statusOptions } from '@/shared/constants/filters'

export const formFields = [
    {
        id: 1,
        name: "name",
        placeholder: "Enter name",
        label: "Name",
        Icon: Mail,
        type: "text",
        division: "personal",
        component: "input",
    },
    {
        id: 2,
        name: "email",
        placeholder: "Enter email",
        label: "Email",
        Icon: Mail,
        type: "email",
        division: "personal",
        component: "input",
    },
    {
        id: 3,
        name: "phoneNumber",
        placeholder: "Enter phone number",
        label: "Phone Number",
        Icon: Phone,
        type: "text",
        division: "personal",
        component: "input",
    },
    {
        id: 4,
        name: "password",
        placeholder: "Enter password",
        label: "Password",
        Icon: Lock,
        type: "password",
        division: "account",
        component: "input",
    },
    {
        id: 5,
        name: "confirmPassword",
        placeholder: "Confirm password",
        label: "Confirm Password",
        Icon: Lock,
        type: "password",
        division: "account",
        component: "input",
    },
    {
        id: 6,
        name: "role",
        placeholder: "Select role",
        label: "Role",
        Icon: UserCheck2Icon,
        type: "text",
        division: "role",
        component: "select",
        options: roleOptions.slice(1),
    },
    {
        id: 7,
        name: "status",
        placeholder: "Select status",
        label: "Status",
        Icon: UserCheck2Icon,
        type: "text",
        division: "role",
        component: "select",
        options: statusOptions.slice(1),

    }
]


export const divisions = [
    {
        id: 1,
        label: "Personal Information",
        division: "personal"
    },

    {
        id: 2,
        label: "Role Information",
        division: "role"
    },

]


export const studentFields = [
    {
        id: 1,
        name: "registrationNumber",
        label: "Registration Number",
        placeholder: "Enter registration number",
        type: "text",
        Icon: Hash,
        division: "student",
        component: "input",
    },
    {
        id: 2,
        name: "rollNumber",
        label: "Roll Number",
        placeholder: "Enter roll number",
        type: "text",
        Icon: Hash,
        division: "student",
        component: "input",
    },
    {
        id: 3,
        name: "department",
        label: "Department",
        division: "student",
        component: "select",
        options: [],
        isApi: true,
    },
    {
        id: 5,
        name: "class",
        label: "Class",
        division: "student",
        component: "select",
        options: [],
        isApi: true,
    },
];

export const instructorFields = [
    {
        id: 1,
        name: "employeeId",
        label: "Employee ID",
        placeholder: "Enter employee ID",
        type: "text",
        Icon: Hash,
        division: "instructor",
        component: "input",
    },
    {
        id: 2,
        name: "department",
        label: "Department",
        division: "instructor",
        component: "select",
        options: [],
        isApi: true,
    },
];