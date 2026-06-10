export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    bio?: string;

    address?: {
        streetNumber?: string;
        streetName?: string;
        addressLine2?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
}
