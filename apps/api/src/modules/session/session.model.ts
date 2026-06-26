import {
    DAYS_OF_WEEK,
    SESSION_STATUS,
    type DayOfWeek,
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
    subject: Types.ObjectId;
    class: Types.ObjectId;
    teacher: Types.ObjectId;

    dayOfWeek: DayOfWeek;

    startTime: string;
    endTime: string;

    room?: string;

    status: SessionStatus;

    createdAt: Date;
    updatedAt: Date;
}

export type SessionDocument = HydratedDocument<Session>;

type SessionModel = Model<Session>;

const sessionSchema = new Schema<Session, SessionModel>(
    {
        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
            index: true,
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
            index: true,
        },

        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        dayOfWeek: {
            type: String,
            enum: DAYS_OF_WEEK,
            required: true,
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
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Prevent duplicate sessions.
 * Example:
 * BSCS-A + Web Development + Monday + 09:00
 */
sessionSchema.index(
    {
        class: 1,
        subject: 1,
        teacher: 1,
        dayOfWeek: 1,
        startTime: 1,
    },
    {
        unique: true,
    }
);

export const SessionModel = model<Session, SessionModel>(
    "Session",
    sessionSchema
);