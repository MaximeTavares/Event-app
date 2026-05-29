import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCurrentUserWithProfileAndAddress } from '../api/api';
import type { UserWithProfileAndAddress } from '../types/types';

export function useGetCurrentUserWithProfileAndAddress(): UseQueryResult<
    UserWithProfileAndAddress | null,
    Error
> {
    return useQuery<UserWithProfileAndAddress | null, Error>({
        queryKey: ['user-profile', 'me'],
        queryFn: () => getCurrentUserWithProfileAndAddress(),
    });
}
