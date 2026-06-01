import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCurrentUserWithProfileAndAddress } from '../api/api';
import type { UserWithProfileAndAddress } from '../types/types';
import { useAuthStore } from '../../auth/store/auth.store';

export function useGetCurrentUserWithProfileAndAddress(): UseQueryResult<
    UserWithProfileAndAddress | null,
    Error
> {
    const { accessToken } = useAuthStore();

    return useQuery<UserWithProfileAndAddress | null, Error>({
        queryKey: ['user-profile', 'me'],
        queryFn: () => getCurrentUserWithProfileAndAddress(),
        retry: false,
        staleTime: 5 * 60 * 1000,
        enabled: !!accessToken,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
}
