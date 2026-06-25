import { LoginInput, RegisterInput } from "@attendance/shared-zod";
import ApiError from "../../shared/utils/ApiError";
import { UserModel } from "../users/user.model";
import { generateAccessToken, generateRefreshToken } from "../../shared/utils/jwt";
import { JwtPayload } from "@attendance/shared-types";
import argon2 from "argon2";

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

    user.password = undefined;


    return user;
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

    user.refreshTokenHash =
        await argon2.hash(refreshToken);

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
) => {

    const user =
        await UserModel.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.refreshTokenHash = null;

    await user.save();

    return true;
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