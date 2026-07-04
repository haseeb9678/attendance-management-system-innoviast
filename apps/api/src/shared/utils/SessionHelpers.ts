import { DateTime } from "luxon";

export const buildSessionDateTime = (
    sessionDate: Date,
    time: string
): Date => {
    const datePart = DateTime.fromJSDate(sessionDate, {
        zone: "Asia/Karachi",
    }).toFormat("yyyy-MM-dd");

    const sessionDateTime = DateTime.fromFormat(
        `${datePart} ${time}`,
        "yyyy-MM-dd HH:mm",
        { zone: "Asia/Karachi" }
    );

    return sessionDateTime.toUTC().toJSDate();
};