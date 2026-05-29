import { useEffect } from 'react';

import { AuthApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { useMe } from '../hooks/use_auth.service';

type Props = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
    const { setAccessToken, clearAuth } = useAuthStore();

    const meQuery = useMe();

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await AuthApi.refresh();

                setAccessToken(data.accessToken);

                await meQuery.refetch();
            } catch {
                clearAuth();
            }
        };

        restoreSession();
    });

    return children;
}
