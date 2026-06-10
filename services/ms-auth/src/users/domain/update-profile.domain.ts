export interface UpdateProfileDomain {
    profile?: {
        firstName?: string;
        lastName?: string;
        bio?: string;
        phone?: string;
        avatarUrl?: string;
        address?: {
            streetNumber?: string;
            streetName?: string;
            addressLine2?: string;
            city?: string;
            postalCode?: string;
            country?: string;
        };
    };
}
