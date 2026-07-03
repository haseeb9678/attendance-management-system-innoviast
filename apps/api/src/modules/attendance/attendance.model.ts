import {
    ATTENDANCE_STATUS,
    type AttendanceStatus,
} from "@attendance/shared-types";
import {
    HydratedDocument,
    Model,
    Schema,
    Types,
    model,
} from "mongoose";

export interface Attendance {
    session: Types.ObjectId;
    student: Types.ObjectId;

    status: AttendanceStatus;

    remarks?: string;

    markedAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

export type AttendanceDocument =
    HydratedDocument<Attendance>;

type AttendanceModel = Model<Attendance>;

const attendanceSchema = new Schema<
    Attendance,
    AttendanceModel
>(
    {
        session: {
            type: Schema.Types.ObjectId,
            ref: "Session",
            required: true,
            index: true,
        },

        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ATTENDANCE_STATUS,
            default: "present",
        },

        remarks: {
            type: String,
            trim: true,
            default: "",
        },

        markedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Prevent marking attendance
 * more than once for the same
 * student in the same session.
 */
attendanceSchema.index(
    {
        session: 1,
        student: 1,
    },
    {
        unique: true,
    }
);

export const AttendanceModel = model<
    Attendance,
    AttendanceModel
>(
    "Attendance",
    attendanceSchema
);