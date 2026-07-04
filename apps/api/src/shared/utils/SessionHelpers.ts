import { DateTime } from "luxon";

export const buildSessionDateTime = (
    sessionDate: Date,
    time: string
): Date => {
    const [hours, minutes] = time.split(":").map(Number);

    const sessionDateTime = DateTime.fromJSDate(sessionDate, {
        zone: "Asia/Karachi",
    })
        .startOf("day")
        .set({
            hour: hours,
            minute: minutes,
            second: 0,
            millisecond: 0,
        });

    return sessionDateTime.toUTC().toJSDate();
};