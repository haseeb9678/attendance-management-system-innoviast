import {
    USER_ROLES,
    USER_ROLE,
    USER_STATUS,
    type UserRole,
    type UserStatus,
} from "@attendance/shared-types";
import argon2 from "argon2";
import {
    HydratedDocument,
    Model,
    Schema,
    Types,
    model,
} from "mongoose";

export interface User {
    // Personal Information
    name: string;
    email: string;
    phoneNumber: string;

    // Authentication
    password: string;
    refreshTokenHash: string | null;

    // Account
    role: UserRole;
    status: UserStatus;

    // Student
    registrationNumber?: string;
    rollNumber?: string;
    class?: Types.ObjectId;

    // Instructor & Student
    department?: Types.ObjectId;

    // Instructor
    employeeId?: string;

    createdAt: Date;
    updatedAt: Date;

    lastLoginAt?: Date;
    currentLoginAt?: Date;


    lastLoginIp?: string;
    currentLoginIp?: string;


    lastUserAgent?: string;
    currentUserAgent?: string;
}

interface UserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    setRefreshToken(refreshToken: string): Promise<void>;
    verifyRefreshToken(refreshToken: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<User, UserMethods>;

type UserModel = Model<User, {}, UserMethods>;

const userSchema = new Schema<User, UserModel, UserMethods>(
    {
        // =========================
        // Personal
        // =========================

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,

            trim: true,
            lowercase: true,
        },

        phoneNumber: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        // =========================
        // Authentication
        // =========================

        password: {
            type: String,
            required: true,
            select: false,
        },

        refreshTokenHash: {
            type: String,
            default: null,
            select: false,
        },

        // =========================
        // Account
        // =========================

        role: {
            type: String,
            enum: USER_ROLES,
            default: USER_ROLE.STUDENT,
        },

        status: {
            type: String,
            enum: USER_STATUS,
            default: "active",
        },

        // =========================
        // Student
        // =========================

        registrationNumber: {
            type: String,
            trim: true,
            sparse: true,
        },

        rollNumber: {
            type: String,
            trim: true,
            sparse: true,
        },

        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            index: true,
        },

        // =========================
        // Instructor & Student
        // =========================

        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            index: true,
        },

        // =========================
        // Instructor
        // =========================

        employeeId: {
            type: String,
            trim: true,
            sparse: true,
        },

        lastLoginAt: Date,
        currentLoginAt: Date,

        lastLoginIp: String,
        currentLoginIp: String,


        lastUserAgent: String,
        currentUserAgent: String,
    },
    {
        timestamps: true,
    }
);

/**
 * Password Hashing
 */
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await argon2.hash(this.password);
});

/**
 * Compare Password
 */
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return argon2.verify(this.password, candidatePassword);
};

/**
 * Store Refresh Token
 */
userSchema.methods.setRefreshToken = async function (
    refreshToken: string
): Promise<void> {
    this.refreshTokenHash = await argon2.hash(refreshToken);
};

/**
 * Verify Refresh Token
 */
userSchema.methods.verifyRefreshToken = async function (
    refreshToken: string
): Promise<boolean> {
    if (!this.refreshTokenHash) {
        return false;
    }

    return argon2.verify(
        this.refreshTokenHash,
        refreshToken
    );
};

/**
 * Unique Indexes
 */
userSchema.index(
    { registrationNumber: 1 },
    {
        unique: true,
        sparse: true,
    }
);

userSchema.index(
    { rollNumber: 1, class: 1 },
    {
        unique: true,
        sparse: true,
    }
);

userSchema.index(
    { employeeId: 1 },
    {
        unique: true,
        sparse: true,
    }
);

export const UserModel = model<User, UserModel>(
    "User",
    userSchema
);