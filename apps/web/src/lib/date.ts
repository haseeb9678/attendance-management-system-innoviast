import { format, formatDistanceToNow, differenceInMinutes } from "date-fns";

export const formatDate = (
    date: string | Date,
    pattern = "dd MMM yyyy"
) => format(new Date(date), pattern);

export const formatTime = (
    date: string | Date,
    pattern = "hh:mm a"
) => format(new Date(date), pattern);

export const formatDateTime = (
    date: string | Date,
    pattern = "dd MMM yyyy, hh:mm a"
) => format(new Date(date), pattern);

export const formatRelativeDate = (date: string | Date) =>
    formatDistanceToNow(new Date(date), {
        addSuffix: true,
    });


export const formatSessionTime = (
    startTime: string,
    endTime: string
) => {
    const [startHour, startMinute] = startTime
        .split(":")
        .map(Number);

    const [endHour, endMinute] = endTime
        .split(":")
        .map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    return `${format(start, "h:mm a")} - ${format(
        end,
        "h:mm a"
    )}`;
};

export const getSessionDuration = (
    startTime: string,
    endTime: string
) => {
    const [startHour, startMinute] = startTime
        .split(":")
        .map(Number);

    const [endHour, endMinute] = endTime
        .split(":")
        .map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    const minutes = differenceInMinutes(end, start);

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours && remainingMinutes) {
        return `${hours} hr ${remainingMinutes} min`;
    }

    if (hours) {
        return `${hours} hr`;
    }

    return `${remainingMinutes} min`;
};