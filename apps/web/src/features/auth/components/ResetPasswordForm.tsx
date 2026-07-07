import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    LoaderCircle,
    Lock,
    LucideArrowLeft,
    TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";

import { resetPasswordSchema } from "@attendance/shared-zod";
import {
    useResetPassword,
    useVerifyResetToken,
} from "../hooks/useAuthMutation";

type ResetPasswordFormValues = {
    token: string;
    password: string;
    confirmPassword: string;
};

type RedirectReason = "missing-token" | "invalid-token" | null;
type TokenStatus = "checking" | "valid" | "invalid" | "missing";

const REDIRECT_SECONDS = 3;

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const tokenFromUrl = useMemo(
        () => searchParams.get("token")?.trim() || "",
        [searchParams]
    );

    const [redirectCountdown, setRedirectCountdown] =
        useState(REDIRECT_SECONDS);

    const [redirectReason, setRedirectReason] =
        useState<RedirectReason>(null);

    const [tokenStatus, setTokenStatus] =
        useState<TokenStatus>("checking");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: tokenFromUrl,
            password: "",
            confirmPassword: "",
        },
    });

    const {
        mutate: verifyResetTokenMutation,
        isPending: isVerifyingToken,
    } = useVerifyResetToken();

    const {
        mutate: resetPasswordMutation,
        isPending: isResettingPassword,
    } = useResetPassword();

    // Verify token immediately on page load
    useEffect(() => {
        if (!tokenFromUrl) {
            setTokenStatus("missing");
            setRedirectReason("missing-token");
            setRedirectCountdown(REDIRECT_SECONDS);
            return;
        }

        setTokenStatus("checking");

        verifyResetTokenMutation(
            { token: tokenFromUrl },
            {
                onSuccess: () => {
                    setTokenStatus("valid");
                },
                onError: () => {
                    setTokenStatus("invalid");
                    setRedirectReason("invalid-token");
                    setRedirectCountdown(REDIRECT_SECONDS);
                },
            }
        );
    }, [tokenFromUrl, verifyResetTokenMutation]);

    // Countdown + redirect handler
    useEffect(() => {
        if (!redirectReason) {
            return;
        }

        const interval = setInterval(() => {
            setRedirectCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    navigate("/forgot-password", { replace: true });
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [redirectReason, navigate]);

    const onSubmit = (data: ResetPasswordFormValues) => {
        resetPasswordMutation(
            {
                token: tokenFromUrl,
                password: data.password,
                confirmPassword: data.confirmPassword,
            },
            {
                onSuccess: (res) => {
                    toast.success(
                        res?.message ||
                        "Password reset successfully. Please login with your new password."
                    );

                    navigate("/login", { replace: true });
                },

                onError: (error: Error) => {
                    toast.error(error.message);

                    setTokenStatus("invalid");
                    setRedirectReason("invalid-token");
                    setRedirectCountdown(REDIRECT_SECONDS);
                },
            }
        );
    };

    // Missing / invalid token UI
    if (redirectReason) {
        const title =
            redirectReason === "missing-token"
                ? "Reset link is missing"
                : "Reset link is invalid or expired";

        const description =
            redirectReason === "missing-token"
                ? "The password reset link is incomplete or missing its token."
                : "This password reset link is no longer valid. Please request a new one.";

        return (
            <div
                className="border border-border bg-bg-card lg:bg-transparent
                lg:border-0 rounded-2xl p-5 w-full max-w-md h-full
                flex flex-col justify-center gap-8"
            >
                <div className="flex flex-col items-center text-center gap-3">
                    <div
                        className="size-14 rounded-full bg-red-500/10
                        text-red-500 flex items-center justify-center"
                    >
                        <TriangleAlert size={28} />
                    </div>

                    <div className="space-y-1">
                        <h2 className="font-bold text-2xl text-primary">
                            {title}
                        </h2>

                        <p className="text-sm text-text-secondary">
                            {description}
                        </p>
                    </div>
                </div>

                <div
                    className="rounded-xl border border-border bg-bg p-4
                    text-center"
                >
                    <p className="text-sm text-text-secondary">
                        Redirecting to forgot password page in{" "}
                        <span className="font-semibold text-primary">
                            {redirectCountdown}
                        </span>{" "}
                        second{redirectCountdown === 1 ? "" : "s"}...
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/forgot-password", { replace: true })
                    }
                    className="text-sm text-primary hover:underline
                    flex items-center gap-1 justify-center cursor-pointer
                    hover:text-primary-hover transition-all duration-200"
                >
                    <LucideArrowLeft
                        strokeWidth={1}
                        size={18}
                    />
                    Go to Forgot Password
                </button>
            </div>
        );
    }

    // Verifying token UI
    if (tokenStatus === "checking" || isVerifyingToken) {
        return (
            <div
                className="border border-border bg-bg-card lg:bg-transparent
                lg:border-0 rounded-2xl p-5 w-full max-w-md h-full
                flex flex-col justify-center items-center gap-4"
            >
                <LoaderCircle
                    className="animate-spin text-primary"
                    size={34}
                />

                <div className="text-center space-y-1">
                    <h2 className="font-bold text-2xl text-primary">
                        Verifying Token...
                    </h2>

                    <p className="text-sm text-text-secondary">
                        Please wait while we verify your password reset link.
                    </p>
                </div>
            </div>
        );
    }

    // Only show form when token is valid
    return (
        <div
            className="border border-border bg-bg-card lg:bg-transparent
            lg:border-0 rounded-2xl p-5 w-full max-w-md h-full
            flex flex-col justify-center gap-12"
        >
            <div className="flex flex-col gap-1 items-center justify-center">
                <h2 className="font-bold text-3xl text-primary">
                    Reset Password
                </h2>
                <p className="text-sm text-text-secondary text-center">
                    Enter your new password below to reset your Attendix account
                    password.
                </p>
            </div>

            <div className="flex flex-col gap-5">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                    method="post"
                >
                    <div className="grid grid-cols-1 gap-3">
                        <FormInput
                            register={register}
                            type="password"
                            placeholder="Enter new password"
                            name="password"
                            errors={errors}
                            label="New Password"
                            Icon={Lock}
                        />

                        <FormInput
                            register={register}
                            type="password"
                            placeholder="Confirm new password"
                            name="confirmPassword"
                            errors={errors}
                            label="Confirm Password"
                            Icon={Lock}
                        />
                    </div>

                    <FormButton
                        type="submit"
                        text="Reset Password"
                        loadingText="Resetting..."
                        isLoading={isResettingPassword}
                    />
                </form>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-primary hover:underline
                    flex items-center gap-1 justify-center cursor-pointer
                    hover:text-primary-hover transition-all duration-200"
                >
                    <LucideArrowLeft
                        strokeWidth={1}
                        size={18}
                    />
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ResetPasswordForm;