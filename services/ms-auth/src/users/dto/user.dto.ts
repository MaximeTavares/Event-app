import { Address } from 'src/users/schema/address.schema';
import { UserNotifications } from 'src/users/schema/userNotifications.schema';
import { UserPreferences } from 'src/users/schema/userPreference.schema';
import { UserProfile } from 'src/users/schema/userProfile.schema';
import { UserAvailability } from '../schema/userAvailability.schema';

export class PublicUserDto {
    id: string;
    email: string;
    profile: UserProfile;
    preferences: UserPreferences;
    notifications: UserNotifications;
    security: {
        twoFactorEnabled: boolean;
    };
    availability: UserAvailability;
}

export interface ProfileDomain {
    profile?: {
        firstName?: string;
        lastName?: string;
        bio?: string;
        address?: Address;
    };
}
