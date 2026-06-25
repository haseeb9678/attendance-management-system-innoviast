import { UserRole } from "@attendance/shared-types";
import argon2 from "argon2";
import {
    HydratedDocument,
    Model,
    Schema,
    model,
} from "mongoose";

export interface User {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    refreshTokenHash: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface UserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    setRefreshToken(refreshToken: string): Promise<void>;
    verifyRefreshToken(refreshToken: string): Promise<boolean>;
}

type UserDocument = HydratedDocument<User, UserMethods>;

type UserModel = Model<User, {}, UserMethods>;

const userSchema = new Schema<User, UserModel, UserMethods>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT,
        },

        refreshTokenHash: {
            type: String,
            default: null,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await argon2.hash(this.password);
});

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return argon2.verify(this.password, candidatePassword);
};

userSchema.methods.setRefreshToken = async function (
    refreshToken: string
): Promise<void> {
    this.refreshTokenHash = await argon2.hash(refreshToken);
};

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

export { type UserDocument };

export const UserModel = model<User, UserModel>(
    "User",
    userSchema
);