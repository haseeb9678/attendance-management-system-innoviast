import cron from "node-cron";
import { updateSessionStatusesService } from "./session.service";

export const startSessionStatusCron =
    () => {
        cron.schedule("* * * * *", async () => {
            try {
                console.log(
                    "[Session Cron] Checking session statuses..."
                );

                const result =
                    await updateSessionStatusesService();

                console.log(
                    `[Session Cron] Done. Checked: ${result.totalChecked}, Updated: ${result.updatedCount}`
                );
            } catch (error) {
                console.error(
                    "[Session Cron] Failed to update session statuses:",
                    error
                );
            }
        });
    };