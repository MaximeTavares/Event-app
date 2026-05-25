import { api } from '../../../shared/utils/axios-client';
import type { UserWithProfileAndAddress } from '../types/types';

export async function getCurrentUserWithProfileAndAddress(): Promise<UserWithProfileAndAddress | null> {
    const { data } = await api.get<UserWithProfileAndAddress>('me/profile');

    return data;
}
