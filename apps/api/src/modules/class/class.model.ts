import {
    CLASS_STATUS,
    type ClassStatus,
} from "@attendance/shared-types";
import {
    HydratedDocument,
    Model,
    Schema,
    Types,
    model,
} from "mongoose";

export interface Class {
    name: string;
    code: string;
    department: Types.ObjectId;
    description?: string;
    status: ClassStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type ClassDocument = HydratedDocument<Class>;

type ClassModel = Model<Class>;

const classSchema = new Schema<Class, ClassModel>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },

        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: CLASS_STATUS,
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Prevent duplicate class names within the same department.
 */
classSchema.index(
    { name: 1, department: 1 },
    { unique: true }
);

/**
 * Prevent duplicate class codes within the same department.
 */
classSchema.index(
    { code: 1, department: 1 },
    { unique: true }
);

export const ClassModel = model<Class, ClassModel>(
    "Class",
    classSchema
);