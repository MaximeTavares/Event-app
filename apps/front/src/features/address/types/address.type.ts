export interface Coordinates {
    lat: number;
    lon: number;
}

export interface Address {
    street_number: string;
    street_name: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    country: string;
    coordinates: Coordinates;
}

export type AddressForCreateEvent = {
    street_number: string;
    street_name: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    country: string;
};

export type AddressForUpdateEvent = Partial<AddressForCreateEvent>;
