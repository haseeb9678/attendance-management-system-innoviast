import {
    SUBJECT_STATUS,
    type SubjectStatus,
} from "@attendance/shared-types";
import {
    HydratedDocument,
    Model,
    Schema,
    Types,
    model,
} from "mongoose";

export interface Subject {
    name: string;
    code: string;
    department: Types.ObjectId;
    description?: string;
    status: SubjectStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type SubjectDocument = HydratedDocument<Subject>;

type SubjectModel = Model<Subject>;

const subjectSchema = new Schema<Subject, SubjectModel>(
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
            enum: SUBJECT_STATUS,
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Prevent duplicate subject names within the same class.
 */
subjectSchema.index(
    { name: 1, department: 1 },
    { unique: true }
);

/**
 * Prevent duplicate subject codes within the same class.
 */
subjectSchema.index(
    { code: 1, department: 1 },
    { unique: true }
);

export const SubjectModel = model<Subject, SubjectModel>(
    "Subject",
    subjectSchema
);