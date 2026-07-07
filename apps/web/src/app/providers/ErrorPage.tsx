import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    ArrowRight,
    Home,
    RefreshCcw,
    LogIn,
} from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store.js";
import { SEO } from "@/shared/components/SEO";
import { getRedirectPathByRole } from "@/lib/redirectpath";

interface ErrorPageProps {
    title?: string;
    description?: string;
    statusCode?: number;
    autoRedirect?: boolean;
    redirectDelay?: number;
    showRefreshButton?: boolean;
}

const ErrorPage = ({
    title = "Page not found",
    description = "The page you’re looking for is unavailable or an unexpected error occurred.",
    statusCode = 404,
    autoRedirect = true,
    redirectDelay = 3000,
    showRefreshButton = true,
}: ErrorPageProps) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const redirectPath = useMemo(
        () => getRedirectPathByRole(isAuthenticated, user),
        [isAuthenticated, user]
    );

    const redirectSeconds = Math.max(
        1,
        Math.ceil(redirectDelay / 1000)
    );

    const [countdown, setCountdown] =
        useState(redirectSeconds);

    const isLoggedIn =
        isAuthenticated && !!user;

    /**
     * Reset countdown when redirect target or delay changes
     */
    useEffect(() => {
        setCountdown(redirectSeconds);
    }, [redirectSeconds, redirectPath]);

    /**
     * UI countdown
     */
    useEffect(() => {
        if (!autoRedirect) return;
        if (countdown <= 1) return;

        const interval = window.setInterval(() => {
            setCountdown((prev) =>
                prev > 1 ? prev - 1 : 1
            );
        }, 1000);

        return () => window.clearInterval(interval);
    }, [autoRedirect, countdown]);

    /**
     * Actual redirect
     */
    useEffect(() => {
        if (!autoRedirect) return;
        if (!redirectPath) return;

        const timer = window.setTimeout(() => {
            navigate(redirectPath, {
                replace: true,
            });
        }, redirectDelay);

        return () => window.clearTimeout(timer);
    }, [
        autoRedirect,
        redirectDelay,
        navigate,
        redirectPath,
    ]);

    return (
        <>
            <SEO
                title={`${statusCode} | Attendix`}
                description={description}
                noindex
            />

            <section
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-bg
                    px-4
                    py-10
                "
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                        scale: 0.98,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.35,
                        ease: "easeOut",
                    }}
                    className="
                        relative
                        w-full
                        max-w-2xl
                        overflow-hidden
                        rounded-3xl
                        border
                        border-border
                        bg-bg-card
                        shadow-xl
                    "
                >
                    {/* glow */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            -top-16
                            -right-16
                            h-48
                            w-48
                            rounded-full
                            bg-primary/10
                            blur-3xl
                        "
                    />

                    <div className="relative p-8 sm:p-10">
                        {/* top content */}
                        <div className="flex flex-col items-center text-center">
                            <div
                                className="
                                    mb-5
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-3xl
                                    bg-error/10
                                    text-error
                                "
                            >
                                <AlertTriangle className="h-10 w-10" />
                            </div>

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    rounded-full
                                    bg-primary/10
                                    px-3
                                    py-1
                                    text-sm
                                    font-medium
                                    text-primary
                                "
                            >
                                Error {statusCode}
                            </div>

                            <h1 className="mt-5 text-3xl font-bold text-text-base sm:text-4xl">
                                {title}
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
                                {description}
                            </p>

                            {autoRedirect && (
                                <p className="mt-4 text-sm text-text-secondary">
                                    You’ll be redirected automatically in{" "}
                                    <span className="font-semibold text-text-base">
                                        {countdown}
                                    </span>{" "}
                                    second
                                    {countdown > 1 ? "s" : ""}.
                                </p>
                            )}
                        </div>

                        {/* actions */}
                        <div
                            className="
                                mt-8
                                flex
                                flex-col
                                justify-center
                                gap-3
                                sm:flex-row
                            "
                        >
                            <Link
                                to={redirectPath}
                                replace
                                className="
                                    inline-flex
                                    h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-primary
                                    px-5
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-primary-hover
                                "
                            >
                                {isLoggedIn ? (
                                    <Home className="h-4 w-4" />
                                ) : (
                                    <LogIn className="h-4 w-4" />
                                )}

                                {isLoggedIn
                                    ? "Go to dashboard"
                                    : "Go to login"}
                            </Link>

                            {showRefreshButton && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        window.location.reload()
                                    }
                                    className="
                                        inline-flex
                                        h-11
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-border
                                        bg-bg
                                        px-5
                                        text-sm
                                        font-medium
                                        text-text-base
                                        transition
                                        hover:bg-surface
                                    "
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Try again
                                </button>
                            )}
                        </div>

                        {/* helper box */}
                        <div
                            className="
                                mt-8
                                rounded-2xl
                                border
                                border-dashed
                                border-border
                                bg-bg/60
                                p-4
                                text-sm
                                text-text-secondary
                            "
                        >
                            <div className="flex items-start gap-3">
                                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <p>
                                    If this keeps happening, check the route,
                                    whether the requested resource still exists,
                                    or whether your current session is valid.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </>
    );
};

export default ErrorPage;