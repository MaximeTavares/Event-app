export type UpdateProfileRequest = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
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