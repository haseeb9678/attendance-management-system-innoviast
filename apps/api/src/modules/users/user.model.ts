import { UserRole } from "@attendance/shared-types";
import {
    InferSchemaType,
    model,
    Schema,
} from "mongoose";
import argon2 from "argon2";


interface UserMethods {
    comparePassword(
        candidatePassword: string
    ): Promise<boolean>;
}

const userSchema = new Schema<
    InferSchemaType<any>,
    {},
    UserMethods
>(
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
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password =
        await argon2.hash(this.password as string);
});

userSchema.methods.comparePassword =
    async function (
        candidatePassword: string
    ) {
        return argon2.verify(
            this.password as string,
            candidatePassword
        );
    };

export type User =
    InferSchemaType<typeof userSchema>;

export const UserModel =
    model("User", userSchema);