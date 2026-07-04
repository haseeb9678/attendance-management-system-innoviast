export const buildSessionDateTime = (
    sessionDate: Date,
    time: string
): Date => {
    // Expected time format: "HH:mm" e.g. "09:30", "14:45"
    const [hours, minutes] = time
        .split(":")
        .map(Number);

    const date = new Date(sessionDate);

    date.setHours(hours, minutes, 0, 0);

    return date;
};