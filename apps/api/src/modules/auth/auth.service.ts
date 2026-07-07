import { LoginInput, RegisterInput } from "@attendance/shared-zod";
import ApiError from "../../shared/utils/ApiError.js";
import { UserModel } from "../user/user.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../shared/utils/jwt.js";
import { JwtPayload } from "@attendance/shared-types";
import crypto from "crypto";
import { GENERIC_FORGOT_PASSWORD_MESSAGE } from "./auth.constants.js";
import {
    CLIENT_URL,
    FORGOT_PASSWORD_LIMIT,
    FORGOT_PASSWORD_WINDOW_MS,
    RESET_PASSWORD_TOKEN_EXPIRES_MS
} from "../../config/env.js";
import { sendResetPasswordEmail } from "./auth.mail.js";



export const registerService = async (data: RegisterInput) => {

    const existingUser = await UserModel.findOne({
        email: data.email,
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "User already exists with this email"
        );
    }

    const user = await UserModel.create({
        name: data.name,
        email: data.email,
        password: data.password,
    });

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    };
};


export const loginService = async (
    data: LoginInput,
    loginInfo: {
        ip?: string;
        userAgent?: string;
    }
) => {

    const user = await UserModel
        .findOne({
            email: data.email,
        })
        .select("+password");

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const isPasswordValid =
        await user.comparePassword(
            data.password
        );

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const payload: JwtPayload = {
        userId: user._id.toString(),
        role: user.role,
    };

    const accessToken =
        generateAccessToken(payload);

    const refreshToken =
        generateRefreshToken(payload);

    await user.setRefreshToken(refreshToken);

    await user.save();

    await UserModel.findByIdAndUpdate(user._id, {
        $set: {
            lastLoginAt: user.currentLoginAt,
            currentLoginAt: new Date(),

            lastLoginIp: user.currentLoginIp,
            currentLoginIp: loginInfo.ip,

            lastUserAgent: user.currentUserAgent,
            currentUserAgent: loginInfo.userAgent,
        },
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },

        accessToken,
        refreshToken,
    };
};

export const logoutService = async (
    userId: string
): Promise<void> => {
    const user = await UserModel.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshTokenHash: null,
            },
        },
        {
            new: false,
        }
    );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }
};
export const getMeService = async (
    userId: string
) => {

    const user =
        await UserModel.findById(
            userId
        ).populate("class department");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const userObj: any = user.toObject();

    userObj.id = userObj._id.toString();

    userObj._id = undefined;
    userObj.password = undefined;
    userObj.refreshTokenHash = undefined;

    return userObj
};

export const refreshTokenService = async (
    refreshToken: string
) => {
    // 1. Verify JWT signature
    const payload = verifyRefreshToken(refreshToken);

    // 2. Find user
    const user = await UserModel.findById(payload.userId)
        .select("+refreshTokenHash");

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    // 3. Verify stored refresh token hash
    const isRefreshTokenValid =
        await user.verifyRefreshToken(refreshToken);

    if (!isRefreshTokenValid) {
        throw new ApiError(401, "Invalid refresh token");
    }

    // 4. Generate new tokens
    const newPayload: JwtPayload = {
        userId: user._id.toString(),
        role: user.role,
    };

    const accessToken = generateAccessToken(newPayload);

    const newRefreshToken =
        generateRefreshToken(newPayload);

    // 5. Rotate refresh token
    await user.setRefreshToken(newRefreshToken);
    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },

        accessToken,

        // Controller will use this to update the cookie.
        newRefreshToken,
    };
};

export const verifyResetTokenService = async (
    token: string
) => {
    const hashedResetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await UserModel.findOne({
        resetPasswordToken: hashedResetToken,
        resetPasswordExpires: {
            $gt: new Date(),
        },
    });

    if (!user) {
        throw new ApiError(
            400,
            "Reset link is invalid or expired."
        );
    }

    return {
        message: "Reset token is valid",
    };
};


export const forgotPasswordService = async (
    email: string
) => {
    const user = await UserModel.findOne({ email });

    // Do not reveal whether the email exists or not
    if (!user) {
        return {
            message: GENERIC_FORGOT_PASSWORD_MESSAGE,
        };
    }

    const now = Date.now();

    // Reset the forgot-password attempt window if it has expired
    if (
        user.forgotPasswordWindowExpires &&
        user.forgotPasswordWindowExpires.getTime() <= now
    ) {
        user.forgotPasswordAttempts = 0;
        user.forgotPasswordWindowExpires = null;
    }

    // Start a new attempt window if there isn't one already
    if (!user.forgotPasswordWindowExpires) {
        user.forgotPasswordAttempts = 0;
        user.forgotPasswordWindowExpires = new Date(
            now + FORGOT_PASSWORD_WINDOW_MS
        );
    }

    // Block if max attempts reached within active window
    if (user.forgotPasswordAttempts >= FORGOT_PASSWORD_LIMIT) {
        const retryAfterMs =
            user.forgotPasswordWindowExpires.getTime() - now;

        const retryAfterMinutes = Math.ceil(
            retryAfterMs / (60 * 1000)
        );

        throw new ApiError(
            429,
            `Too many password reset requests. Please try again in ${retryAfterMinutes} minute(s).`
        );
    }

    // Generate raw token for email
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only hashed token in DB
    const hashedResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = new Date(
        now + RESET_PASSWORD_TOKEN_EXPIRES_MS
    );

    user.forgotPasswordAttempts += 1;

    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;


    try {

        await sendResetPasswordEmail({
            to: user.email,
            name: user.name,
            resetUrl,
        });

    } catch {
        // Roll back token if email sending fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Roll back the incremented attempt count too
        user.forgotPasswordAttempts = Math.max(
            0,
            user.forgotPasswordAttempts - 1
        );

        if (user.forgotPasswordAttempts === 0) {
            user.forgotPasswordWindowExpires = null;
        }

        await user.save();

        throw new ApiError(
            500,
            "Failed to send password reset email. Please try again later."
        );
    }

    return {
        message: GENERIC_FORGOT_PASSWORD_MESSAGE,
    };
};

export const resetPasswordService = async (
    data: {
        token: string;
        password: string;
    }
) => {
    const hashedResetToken = crypto
        .createHash("sha256")
        .update(data.token)
        .digest("hex");

    const user = await UserModel.findOne({
        resetPasswordToken: hashedResetToken,
        resetPasswordExpires: {
            $gt: new Date(),
        },
    }).select("+password");

    if (!user) {
        throw new ApiError(
            400,
            "Reset link is invalid or expired."
        );
    }

    user.password = data.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Reset forgot-password rate-limit data after successful reset
    user.forgotPasswordAttempts = 0;
    user.forgotPasswordWindowExpires = null;

    // Invalidate old refresh sessions/tokens after password reset
    user.refreshTokenHash = null;

    await user.save();

    return {
        message: "Password has been reset successfully.",
    };
};