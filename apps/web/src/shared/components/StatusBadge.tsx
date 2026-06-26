interface StatusBadgeProps {
    status: "active" | "inactive" | "pending" | "suspended";
}

const statusStyles = {
    active:
        "bg-success-bg text-success",

    inactive:
        "bg-warning-bg text-warning",

    pending:
        "bg-success-bg text-success",
    suspended:
        "bg-success-bg text-success",
};

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