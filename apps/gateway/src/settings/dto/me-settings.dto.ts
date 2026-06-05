export type WeekDay =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

export type ProfileVisibility = 'public' | 'events_only' | 'organizers_only';

export type SettingsAddressDto = {
    street_number: string;
    street_name: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    country: string;
    coordinates?: {
        lat: number;
        lon: number;
    };
};

export type MeSettingsDto = {
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        address: SettingsAddressDto;
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
};

export const WEEK_DAYS: WeekDay[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];

export function defaultMeSettings(): MeSettingsDto {
    return {
        profile: {
            firstName: '',
            lastName: '',
            email: '',
            address: {
                street_number: '',
                street_name: '',
                city: '',
                postal_code: '',
                country: 'France',
            },
            skills: '',
        },
        security: {
            twoFactorEnabled: false,
        },
        notifications: {
            enabled: true,
            eventActivity: true,
            eventMessages: true,
            documents: true,
            deadlines: true,
            nearbyEvents: false,
            judgments: true,
        },
        preferences: {
            fontSize: 'md',
            highContrast: false,
            timeFormat: '24',
            dateFormat: 'eu',
            distanceUnit: 'km',
            language: 'fr',
            profileVisibility: 'events_only',
            showEmail: false,
            showPhone: false,
            defaultCalendarView: 'mois',
            defaultSearchCity: '',
        },
        availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
        },
    };
}
