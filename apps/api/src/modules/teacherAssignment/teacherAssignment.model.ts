import {
    ASSIGNMENT_STATUS,
    type AssignmentStatus,
} from "@attendance/shared-types";
import {
    HydratedDocument,
    Model,
    Schema,
    Types,
    model,
} from "mongoose";

export interface TeacherAssignment {
    instructor: Types.ObjectId;
    department: Types.ObjectId;
    class: Types.ObjectId;
    subject: Types.ObjectId;
    status: AssignmentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type TeacherAssignmentDocument =
    HydratedDocument<TeacherAssignment>;

type TeacherAssignmentModel = Model<TeacherAssignment>;

const teacherAssignmentSchema = new Schema<
    TeacherAssignment,
    TeacherAssignmentModel
>(
    {
        instructor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },

        status: {
            type: String,
            enum: ASSIGNMENT_STATUS,
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Prevent assigning the same instructor
 * to the same subject in the same class twice.
 */
teacherAssignmentSchema.index(
    {
        instructor: 1,
        class: 1,
        subject: 1,
    },
    {
        unique: true,
    }
);

/**
 * Speed up filtering by department.
 */
teacherAssignmentSchema.index({
    department: 1,
});

export const TeacherAssignmentModel = model<
    TeacherAssignment,
    TeacherAssignmentModel
>("TeacherAssignment", teacherAssignmentSchema);