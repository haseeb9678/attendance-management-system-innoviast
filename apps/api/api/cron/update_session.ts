
import { updateSessionStatusesService } from "../../src/modules/session/session.service.js";
import { CRON_SECRET } from "../../src/config/env.js";

export default async function handler(
    req: any,
    res: any
) {
    try {
        /**
         * Optional security:
         * only allow Vercel cron or your secret
         */
        const authHeader =
            req.headers.authorization;

        if (
            CRON_SECRET &&
            authHeader !==
            `Bearer ${CRON_SECRET}`
        ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        console.log("[Cron Init Check], in VERCEL CRON");
        const result =
            await updateSessionStatusesService();

        return res.status(200).json({
            success: true,
            message:
                "Session statuses updated successfully.",
            data: result,
        });
    } catch (error) {
        console.error(
            "[Vercel Cron] Failed to update session statuses:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update session statuses.",
        });
    }
}