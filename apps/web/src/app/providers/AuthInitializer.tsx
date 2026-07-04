import { useEffect } from "react";

import { refresh } from "@/features/auth/api/auth.api";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { Spinner } from "@/components/ui/spinner";
import { useThemeStore } from "@/shared/store/theme.store";

interface Props {
    children: React.ReactNode;
}

const AuthInitializer = ({
    children,
}: Props) => {
    const auth = useAuthStore();

    useEffect(() => {
        const initialize = async () => {
            try {
                const res = await refresh();

                auth.login({
                    user: res.data,
                    accessToken:
                        res.meta.accessToken,
                });
            } catch {
                auth.logout();
            } finally {
                auth.finishInitialization();
            }
        };

        initialize();
    }, []);



    if (auth.isInitializing) {
        return (
            <div className="h-screen flex items-center gap-1.5 justify-center text-lg
             bg-bg text-text-secondary font-semibold">
                <Spinner
                    className="size-6"
                />
                <p>Authenticating...</p>
            </div>
        );
    }

    return children;
};

export default AuthInitializer;