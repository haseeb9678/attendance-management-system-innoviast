import ApiResponse from "../../shared/utils/ApiResponse.js";
import { asyncHandler } from "../../shared/utils/AsyncHandler.js";
import { getAdminDashboardStatsService, updateAdminProfileService } from "./admin.service.js";

import { Request, Response } from "express";


export const getAdminDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const dashboard =
            await getAdminDashboardStatsService();

        res.status(200).json(
            new ApiResponse(
                200,
                "Admin dashboard fetched successfully.",
                dashboard
            )
        );
    }
);

export const updateAdminProfile = asyncHandler(
    async (req: Request, res: Response) => {

        const updatedAdmin = await updateAdminProfileService(
            req.user.userId as string,
            req.body
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Admin profile updated successfully.",
                updatedAdmin
            )
        );
    }
);