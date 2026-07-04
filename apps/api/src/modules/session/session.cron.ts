import cron from "node-cron";
import { updateSessionStatusesService } from "./session.service.js";

export const startSessionStatusCron = () => {

    const isVercel = !!process.env.VERCEL;
    const isProduction = process.env.NODE_ENV === "production";

    if (isVercel || isProduction) {
        console.log("[Local Cron] Skipped on Vercel/production.");
        return;
    }

    cron.schedule("*/1 * * * *", async () => {
        try {
            console.log(
                "[Local Cron] Updating session statuses..."
            );

            const result =
                await updateSessionStatusesService();

            console.log(
                `[Local Cron] Done. Checked: ${result.totalChecked}, Updated: ${result.updatedCount}`
            );
        } catch (error) {
            console.error(
                "[Local Cron] Failed to update session statuses:",
                error
            );
        }
    });
};