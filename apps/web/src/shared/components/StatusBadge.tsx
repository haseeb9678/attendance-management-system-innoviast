interface StatusBadgeProps {
    status:
    | "active"
    | "inactive"
    | "pending"
    | "suspended"
    | "scheduled"
    | "ongoing"
    | "completed"
    | "cancelled";
}

const statusStyles = {
    active: "bg-success-bg text-success",
    inactive: "bg-warning-bg text-warning",
    pending: "bg-warning-bg text-warning",
    suspended: "bg-error/10 text-error",

    scheduled: "bg-primary/10 text-primary",
    ongoing: "bg-success-bg text-success",
    completed: "bg-secondary/10 text-secondary",
    cancelled: "bg-error/10 text-error",
} satisfies Record<StatusBadgeProps["status"], string>;

const StatusBadge = ({ status }: StatusBadgeProps) => {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs
                 font-medium capitalize ${statusStyles[status]}`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;