// shared/types/formField.ts

import type { Path, FieldValues } from "react-hook-form";

export interface FormField<T extends FieldValues> {
    id: number;
    name: Path<T>;
    label: string;
    component: "input" | "select";
    placeholder?: string;
    type?: string;
    Icon?: any;
    options?: any[];
    isApi?: boolean
}