import {
    DEPARTMENT_STATUS,
    type DepartmentStatus,
} from "@attendance/shared-types";
import {
    HydratedDocument,
    Model,
    Schema,
    model,
} from "mongoose";

export interface Department {
    name: string;
    code: string;
    description?: string;
    status: DepartmentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type DepartmentDocument = HydratedDocument<Department>;

type DepartmentModel = Model<Department>;

const departmentSchema = new Schema<Department, DepartmentModel>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: DEPARTMENT_STATUS,
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Prevent duplicate department names.
 */
departmentSchema.index(
    { name: 1 },
    { unique: true }
);

export const DepartmentModel = model<Department, DepartmentModel>(
    "Department",
    departmentSchema
);