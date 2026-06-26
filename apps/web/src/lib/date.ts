import { format, formatDistanceToNow } from "date-fns";

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