import { LoginInput, RegisterInput } from "@attendance/shared-zod";
import ApiError from "../../shared/utils/ApiError.js";
import { UserModel } from "../users/user.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../shared/utils/jwt.js";
import { JwtPayload } from "@attendance/shared-types";

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
    data: LoginInput
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
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
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