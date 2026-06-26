import { SUBJECT_STATUS } from "@attendance/shared-types";
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
    status: (typeof SUBJECT_STATUS)[number];
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
            unique: true,
            uppercase: true,
            trim: true,
        },

        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
            index: true,
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

subjectSchema.index(
    {
        name: 1,
        department: 1,
    },
    {
        unique: true,
    }
);

export const SubjectModel = model<Subject, SubjectModel>(
    "Subject",
    subjectSchema
);