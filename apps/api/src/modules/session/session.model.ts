import {
    SESSION_STATUS,
    type SessionStatus,
} from "@attendance/shared-types";
import {
    HydratedDocument,
    Model,
    Schema,
    Types,
    model,
} from "mongoose";

export interface Session {
    teacherAssignment: Types.ObjectId;

    date: Date;

    startTime: string;
    endTime: string;

    room?: string;

    status: SessionStatus;

    createdAt: Date;
    updatedAt: Date;
}

export type SessionDocument =
    HydratedDocument<Session>;

type SessionModel = Model<Session>;

const sessionSchema = new Schema<
    Session,
    SessionModel
>(
    {
        teacherAssignment: {
            type: Schema.Types.ObjectId,
            ref: "TeacherAssignment",
            required: true,
            index: true,
        },

        date: {
            type: Date,
            required: true,
            index: true,
        },

        startTime: {
            type: String,
            required: true,
            trim: true,
        },

        endTime: {
            type: String,
            required: true,
            trim: true,
        },

        room: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: SESSION_STATUS,
            default: "scheduled",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Prevent creating the same session twice.
 *
 * Example:
 * Teacher Assignment #123
 * 24 Aug 2026
 * 09:00
 */
sessionSchema.index(
    {
        teacherAssignment: 1,
        date: 1,
        startTime: 1,
    },
    {
        unique: true,
    }
);

export const SessionModel = model<
    Session,
    SessionModel
>(
    "Session",
    sessionSchema
);