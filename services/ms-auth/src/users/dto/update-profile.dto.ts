class AddressDto {
    streetNumber?: string;

    streetName?: string;

    addressLine2?: string;

    city?: string;

    postalCode?: string;

    country?: string;
}

export class UpdateProfileDto {
    firstName?: string;

    lastName?: string;

    phone?: string;

    avatarUrl?: string;

    bio?: string;

    address?: AddressDto;
}
