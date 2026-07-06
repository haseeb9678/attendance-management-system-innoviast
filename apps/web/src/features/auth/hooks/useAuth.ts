import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/auth.api";
import { authKeys } from "../api/auth.keys";

export const useMe = () => {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: getMe,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,

    });
};