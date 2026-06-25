import jwt, { SignOptions } from "jsonwebtoken";

import {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
} from "../../config/env.js";

import type {
    JwtPayload,
} from "@attendance/shared-types";

const generateToken = (
    payload: JwtPayload,
    secret: string,
    expiresIn: SignOptions["expiresIn"]
) => {
    return jwt.sign(payload, secret, {
        expiresIn,
    });
};

export const generateAccessToken = (
    payload: JwtPayload
) =>
    generateToken(
        payload,
        JWT_ACCESS_SECRET,
        JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
    );

export const generateRefreshToken = (
    payload: JwtPayload
) =>
    generateToken(
        payload,
        JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
    );

export const verifyToken = (
    token: string,
    secret: string
): JwtPayload => {
    return jwt.verify(
        token,
        secret
    ) as JwtPayload;
};

export const verifyAccessToken = (
    token: string
) =>
    verifyToken(
        token,
        JWT_ACCESS_SECRET
    );

export const verifyRefreshToken = (
    token: string
) =>
    verifyToken(
        token,
        JWT_REFRESH_SECRET
    );