import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import { Spinner } from "@/components/ui/spinner";

import { useMe } from "@/features/auth/hooks/useAuth";
import { useUpdatePassword } from "@/features/users/hooks/useUserMutation";
import { useUpdateStudentProfile } from "@/features/student/hooks/useStudentMutation";

import {
    updatePasswordSchema,
    updateUserSchema,
    type UpdatePasswordInput,
    type UpdateUserInput,
} from "@attendance/shared-zod";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    BadgeCheck,
    Building2,
    GraduationCap,
    Hash,
    KeyRound,
    Lock,
    Mail,
    PencilLine,
    Phone,
    User,
    X,
    BookMarked,
    IdCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Profile = () => {
    const { data, isPending, isError, error } = useMe();
    const user = data?.data;

    const [isUpdateOpen, setIsUpdateOpen] =
        React.useState(false);

    const [
        isChangePasswordOpen,
        setIsChangePasswordOpen,
    ] = React.useState(false);

    if (isPending)
        return (
            <section
                className="
                    flex justify-center items-center gap-2
                    flex-1 text-primary-hover
                "
            >
                <Spinner className="size-6" />
                Loading...
            </section>
        );

    if (!isPending && isError)
        return (
            <section
                className="
                    flex justify-center items-center gap-2
                    flex-1 text-text-secondary
                "
            >
                {error?.message ||
                    "Something went wrong"}
            </section>
        );

    return (
        <>
            <motion.section
                initial={{
                    opacity: 0,
                    y: 18,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut",
                }}
                className="
                    bg-bg-card
                    border border-border
                    rounded-2xl
                    shadow-sm
                    flex flex-col
                    flex-1
                    min-w-0
                    h-max
                    overflow-hidden
                "
            >
                {/* Header */}
                <div className="p-6 border-b border-dashed border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div>
                            <h2 className="text-2xl font-bold text-text-base">
                                My Profile
                            </h2>

                            <p className="text-sm text-text-muted mt-1">
                                Manage your student profile information and account settings.
                            </p>
                        </div>

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                                rotate: -8,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                rotate: 0,
                            }}
                            transition={{
                                duration: 0.35,
                            }}
                            className="
                                h-14 w-14
                                rounded-2xl
                                bg-primary/10
                                flex items-center justify-center
                                shrink-0
                            "
                        >
                            <User
                                className="text-primary"
                                size={24}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Hero / summary strip */}
                <div className="p-6 border-b border-dashed border-border">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 16,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.08,
                            duration: 0.35,
                        }}
                        className="
                            relative overflow-hidden
                            rounded-3xl
                            border border-border
                            bg-gradient-to-br
                            from-primary/10
                            via-bg
                            to-success/10
                            p-6
                        "
                    >
                        <div
                            className="
                                absolute -top-12 -right-10
                                h-32 w-32 rounded-full
                                bg-primary/10 blur-3xl
                                pointer-events-none
                            "
                        />
                        <div
                            className="
                                absolute -bottom-10 -left-8
                                h-28 w-28 rounded-full
                                bg-success/10 blur-3xl
                                pointer-events-none
                            "
                        />

                        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="
                                        h-16 w-16 rounded-2xl
                                        bg-primary text-white
                                        flex items-center justify-center
                                        text-2xl font-bold
                                        shrink-0
                                        shadow-sm
                                    "
                                >
                                    {user?.name?.[0] ?? "S"}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-xl font-bold text-text-base break-words">
                                        {user?.name || "--"}
                                    </h3>

                                    <p className="text-sm text-text-secondary break-all">
                                        {user?.email || "--"}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <BadgePill
                                            text={
                                                user?.role ||
                                                "student"
                                            }
                                            className="bg-primary/12 text-primary"
                                        />

                                        <BadgePill
                                            text={
                                                user?.status ||
                                                "active"
                                            }
                                            className="bg-success/12 text-success"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <FormButton
                                    type="button"
                                    text="Update"
                                    Icon={
                                        PencilLine
                                    }
                                    className="
                                        min-w-max max-w-50 h-10! px-5 text-sm
                                        bg-success hover:bg-success-hover
                                    "
                                    onClick={() =>
                                        setIsUpdateOpen(
                                            true
                                        )
                                    }
                                />

                                <FormButton
                                    type="button"
                                    text="Change Password"
                                    Icon={
                                        KeyRound
                                    }
                                    className="
                                        min-w-max max-w-50 h-10! px-5 text-sm
                                        bg-warning hover:bg-warning-hover
                                    "
                                    onClick={() =>
                                        setIsChangePasswordOpen(
                                            true
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-6">
                    <AnimatedSection delay={0.1}>
                        <ParentBox label="Personal Information">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <ReadOnlyInput
                                    label="Name"
                                    value={
                                        user?.name
                                    }
                                    icon={
                                        <User
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <ReadOnlyInput
                                    label="Email"
                                    value={
                                        user?.email
                                    }
                                    icon={
                                        <Mail
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <ReadOnlyInput
                                    label="Phone Number"
                                    value={
                                        user?.phoneNumber
                                    }
                                    icon={
                                        <Phone
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <ReadOnlyInput
                                    label="Status"
                                    value={
                                        user?.status
                                    }
                                    icon={
                                        <BadgeCheck
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />
                            </div>
                        </ParentBox>
                    </AnimatedSection>

                    <AnimatedSection delay={0.16}>
                        <ParentBox label="Academic Information">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <ReadOnlyInput
                                    label="Role"
                                    value={
                                        user?.role
                                    }
                                    icon={
                                        <GraduationCap
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <ReadOnlyInput
                                    label="Department"
                                    value={
                                        user
                                            ?.department
                                            ?.name
                                            ? `${user.department.name} (${user.department.code})`
                                            : "--"
                                    }
                                    icon={
                                        <Building2
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <ReadOnlyInput
                                    label="Registration Number"
                                    value={
                                        user?.registrationNumber
                                    }
                                    icon={
                                        <IdCard
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <ReadOnlyInput
                                    label="Roll Number"
                                    value={
                                        user?.rollNumber
                                    }
                                    icon={
                                        <Hash
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <ReadOnlyInput
                                    label="Class"
                                    value={
                                        user?.class
                                            ?.name
                                            ? `${user.class.name} (${user.class.code})`
                                            : "--"
                                    }
                                    icon={
                                        <BookMarked
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />
                            </div>
                        </ParentBox>
                    </AnimatedSection>
                </div>
            </motion.section>

            <AnimatePresence>
                {isUpdateOpen && (
                    <UpdateProfile
                        user={user}
                        setIsOpen={
                            setIsUpdateOpen
                        }
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isChangePasswordOpen && (
                    <ChangePassword
                        setIsOpen={
                            setIsChangePasswordOpen
                        }
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Profile;

/* ---------------------------- */
/* Update Profile Modal */
/* ---------------------------- */

const UpdateProfile = ({
    setIsOpen,
    user,
}: {
    setIsOpen: (open: boolean) => void;
    user: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(
            updateUserSchema
        ),
    });

    const { mutate, isPending } =
        useUpdateStudentProfile();

    const onSubmit = (
        data: UpdateUserInput
    ) => {
        mutate(data, {
            onSuccess: () => {
                setIsOpen(false);
                toast.success(
                    "Profile updated successfully"
                );
                window.location.reload();
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    };

    useEffect(() => {
        reset({
            name: user?.name,
            phoneNumber:
                user?.phoneNumber,
        });
    }, [user, reset]);

    return (
        <ModalShell
            title="Update Profile"
            description="Update your student profile information."
            onClose={() => setIsOpen(false)}
        >
            <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(
                    onSubmit
                )}
                method="post"
            >
                <FormInput
                    register={register}
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Enter your name"
                    errors={errors}
                    Icon={User}
                />

                <FormInput
                    register={register}
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    placeholder="Enter your phone number"
                    errors={errors}
                    Icon={Phone}
                />

                <FormInput
                    register={register}
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    errors={errors}
                    Icon={Lock}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                    <FormButton
                        type="button"
                        text="Cancel"
                        className="bg-error text-white hover:bg-error-hover"
                        onClick={() =>
                            setIsOpen(false)
                        }
                    />

                    <FormButton
                        type="submit"
                        text="Update"
                        className="bg-success text-white hover:bg-success-hover"
                        disabled={isPending}
                        isLoading={isPending}
                        loadingText="Updating"
                    />
                </div>
            </form>
        </ModalShell>
    );
};

/* ---------------------------- */
/* Change Password Modal */
/* ---------------------------- */

const ChangePassword = ({
    setIsOpen,
}: {
    setIsOpen: (open: boolean) => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(
            updatePasswordSchema
        ),
    });

    const { mutate, isPending } =
        useUpdatePassword();

    const onSubmit = (
        data: UpdatePasswordInput
    ) => {
        mutate(
            {
                body: data,
            },
            {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success(
                        "Password updated successfully"
                    );
                },
                onError: (err) => {
                    toast.error(
                        err.message
                    );
                },
            }
        );
    };

    return (
        <ModalShell
            title="Change Password"
            description="Update your account password securely."
            onClose={() => setIsOpen(false)}
        >
            <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(
                    onSubmit
                )}
                method="post"
            >
                <FormInput
                    register={register}
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    errors={errors}
                    Icon={Lock}
                />

                <FormInput
                    register={register}
                    name="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                    errors={errors}
                    Icon={Lock}
                />

                <FormInput
                    register={register}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your new password"
                    errors={errors}
                    Icon={Lock}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                    <FormButton
                        type="button"
                        text="Cancel"
                        className="bg-error text-white hover:bg-error-hover"
                        onClick={() =>
                            setIsOpen(false)
                        }
                    />

                    <FormButton
                        type="submit"
                        text="Change Password"
                        className="bg-warning text-white hover:bg-warning-hover"
                        disabled={isPending}
                        isLoading={isPending}
                        loadingText="Updating"
                    />
                </div>
            </form>
        </ModalShell>
    );
};

/* ---------------------------- */
/* Reusable Components */
/* ---------------------------- */

const ModalShell = ({
    title,
    description,
    children,
    onClose,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
    onClose: () => void;
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
            }}
            className="
                bg-black/70 fixed inset-0 z-50
                flex items-center justify-center
                px-4
            "
            onClick={onClose}
        >
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeOut",
                }}
                onClick={(e) =>
                    e.stopPropagation()
                }
                className="
                    bg-bg-card border border-border rounded-2xl shadow-md p-5
                    w-11/12 sm:min-w-md max-w-xl
                    flex flex-col gap-8
                "
            >
                <div className="flex justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-text-base">
                            {title}
                        </h2>
                        <p className="text-sm text-text-muted">
                            {description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            h-10 w-10 rounded-xl
                            bg-surface text-text-base
                            flex items-center justify-center
                            hover:opacity-90 transition
                        "
                    >
                        <X size={22} />
                    </button>
                </div>

                {children}
            </motion.div>
        </motion.div>
    );
};

const ReadOnlyInput = ({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string;
    icon?: React.ReactNode;
}) => {
    return (
        <motion.div
            whileHover={{
                y: -2,
            }}
            className="flex flex-col gap-2"
        >
            <h2 className="font-semibold text-sm text-text-base">
                {label}
            </h2>

            <div
                className="
                    h-12 w-full border capitalize px-3
                    text-text-secondary flex items-center
                    border-border rounded-xl bg-bg
                    truncate
                "
            >
                {icon && (
                    <div className="mr-2 shrink-0">
                        {icon}
                    </div>
                )}
                <span className="truncate">
                    {value || "--"}
                </span>
            </div>
        </motion.div>
    );
};

interface ParentBoxProps {
    label: string;
    children: React.ReactNode;
}

const ParentBox = ({
    label,
    children,
}: ParentBoxProps) => {
    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border border-border
                bg-bg-card
                shadow-sm
            "
        >
            <div className="h-1 w-full bg-primary" />

            <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-text-base">
                    {label}
                </h2>
            </div>

            <div className="space-y-5 p-6">
                {children}
            </div>
        </section>
    );
};

const AnimatedSection = ({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 16,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
                delay,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
};

const BadgePill = ({
    text,
    className,
}: {
    text: string;
    className?: string;
}) => {
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${className}`}
        >
            {text}
        </span>
    );
};