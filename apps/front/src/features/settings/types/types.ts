export const WEEK_DAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export type ProfileVisibility = 'public' | 'events_only' | 'organizers_only';

export type SettingsAddress = {
    street_number?: string;
    street_name?: string;
    address_line_2?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    coordinates?: {
        lat: number;
        lon: number;
    };
};

export interface MeSettings {
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        address: SettingsAddress;
        skills: string;
    };
    security: {
        twoFactorEnabled: boolean;
    };
    notifications: {
        enabled: boolean;
        eventActivity: boolean;
        eventMessages: boolean;
        documents: boolean;
        deadlines: boolean;
        nearbyEvents: boolean;
        judgments: boolean;
    };
    preferences: {
        fontSize: 'sm' | 'md' | 'lg';
        highContrast: boolean;
        timeFormat: '24' | '12';
        dateFormat: 'eu' | 'us';
        distanceUnit: 'km' | 'mi';
        language: 'fr' | 'en';
        profileVisibility: ProfileVisibility;
        showEmail: boolean;
        showPhone: boolean;
        defaultCalendarView: string;
        defaultSearchCity: string;
    };
    availability: Record<WeekDay, boolean>;
}

export type SettingsNavOption = {
    id: string;
    label: string;
    path: string;
};

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export type UpdateProfilePayload = Partial<MeSettings['profile']>;
export type UpdatePreferencesPayload = Partial<MeSettings['preferences']>;
export type UpdateNotificationsPayload = Partial<MeSettings['notifications']>;
export type UpdateSecurityPayload = Partial<MeSettings['security']>;
export type UpdateAvailabilityPayload = Partial<MeSettings['availability']>;
