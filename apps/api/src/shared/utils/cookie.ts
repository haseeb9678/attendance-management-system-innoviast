import { Response } from "express";
import { ACCESS_COOKIE_MAX_AGE, NODE_ENV, REFRESH_COOKIE_MAX_AGE } from "../../config/env.js";

const isProduction = NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
};

export const setAccessTokenCookie = (
    res: Response,
    token: string
) => {
    res.cookie(
        "accessToken",
        token,
        {
            ...cookieOptions,
            maxAge: ACCESS_COOKIE_MAX_AGE
        }
    );
};

export const setRefreshTokenCookie = (
    res: Response,
    token: string
) => {
    res.cookie(
        "refreshToken",
        token,
        {
            ...cookieOptions,
            maxAge: REFRESH_COOKIE_MAX_AGE
        }
    );
};

export const clearAuthCookies = (
    res: Response
) => {
    res.clearCookie(
        "accessToken",
        cookieOptions
    );

    res.clearCookie(
        "refreshToken",
        cookieOptions
    );
};