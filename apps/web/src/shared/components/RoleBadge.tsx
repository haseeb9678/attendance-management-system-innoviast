interface RoleBadgeProps {
    role: "admin" | "instructor" | "student";
}

const roleStyles = {
    admin:
        "bg-role-admin-bg text-role-admin",

    instructor:
        "bg-role-instructor-bg text-role-instructor",

    student:
        "bg-role-instructor-bg text-role-instructor",
};

const RoleBadge = ({ role }: RoleBadgeProps) => {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${roleStyles[role]}`}
        >
            {role}
        </span>
    );
};

export default RoleBadge;