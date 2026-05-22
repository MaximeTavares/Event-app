import type { Address } from '../../address/types/address.type';
import type { User } from '../../user/types/user.type';

export interface UserProfile {
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    birthDate?: Date | null;
    bio?: string | null;
    avatarUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date | null;
    fullName?: string | null;
    age?: number | null;
}

export interface UserWithProfileAndAddress {
    user: User;
    profile: UserProfile | null;
    address: Address | null;
}
