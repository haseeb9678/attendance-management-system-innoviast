
import { updateSessionStatusesService } from "../../src/modules/session/session.service.js";
import { CRON_SECRET } from "../../src/config/env.js";

export default async function handler(req: any, res: any) {
    try {
        const authHeader = req.headers.authorization;
        const hasValidBearerToken =
            Boolean(CRON_SECRET) && authHeader === `Bearer ${CRON_SECRET}`;

        if (CRON_SECRET && !hasValidBearerToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await updateSessionStatusesService();

        return res.status(200).json({
            success: true,
            message: "Session statuses updated successfully.",
            data: result,
        });
    } catch (error) {
        console.error("[QStash Cron] Failed to update session statuses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update session statuses.",
        });
    }
}