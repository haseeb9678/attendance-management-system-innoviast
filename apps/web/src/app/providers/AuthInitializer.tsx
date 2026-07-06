import { useEffect } from "react";

import { refresh } from "@/features/auth/api/auth.api";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { Spinner } from "@/components/ui/spinner";

import Icon from "/icon_attendix.png"


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
            <div className="h-screen flex flex-col items-center gap-2 justify-center text-lg
             bg-bg text-text-secondary font-semibold">
                <div
                    className='h-10 w-max overflow-hidden animate-pulse'
                >
                    <img
                        className='h-full w-full'
                        src={Icon} alt="icon" />
                </div>
                <div className="flex gap-1.5 items-center">
                    <Spinner
                        className="size-6"
                    />
                    <p>Authenticating...</p>
                </div>

            </div>
        );
    }

    return children;
};

export default AuthInitializer;