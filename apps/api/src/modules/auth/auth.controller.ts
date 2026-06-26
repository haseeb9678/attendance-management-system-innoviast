import ApiError from "../../shared/utils/ApiError.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "../../shared/utils/cookie.js";
import { getMeService, loginService, logoutService, refreshTokenService, registerService } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {

    const user = await registerService(req.body)

    res.status(200).json(
        new ApiResponse(200, "User registered successfully", user)
    )
})

export const login = asyncHandler(
    async (req, res) => {

        const result =
            await loginService(req.body);

        const {
            accessToken,
            refreshToken,
            ...responseData
        } = result;

        setAccessTokenCookie(
            res,
            accessToken
        );

        setRefreshTokenCookie(
            res,
            refreshToken
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Login successful",
                responseData
            )
        );
    }
);

export const logout = asyncHandler(
    async (req, res) => {

        await logoutService(
            req.user.userId
        );

        clearAuthCookies(res);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Logout successful",
                null
            )
        );
    }
);

export const me = asyncHandler(
    async (req, res) => {

        const user =
            await getMeService(
                req.user!.userId
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "User fetched successfully",
                user
            )
        );
    }
);

export const refreshToken = asyncHandler(
    async (req, res) => {
        const refreshToken =
            req.cookies.refreshToken;

        if (!refreshToken) {
            throw new ApiError(
                401,
                "Refresh token not found"
            );
        }

        const {
            user,
            accessToken,
            refreshToken: newRefreshToken,
        } = await refreshTokenService(
            refreshToken
        );

        setAccessTokenCookie(
            res,
            accessToken
        );

        setRefreshTokenCookie(
            res,
            newRefreshToken
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Token refreshed successfully",
                user,
            )
        );
    }
);