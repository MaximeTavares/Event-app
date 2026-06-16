export interface AddressDTO {
    id: number;
    street_number: string;
    street_name: string;
    address_line_2?: string | null;
    city: string;
    postal_code: string;
    country: string;
    coordinates?: { lat: number; lon: number };
}

export interface Address {
    id: number;
    street_number: string;
    street_name: string;
    address_line_2: string | null;
    city: string;
    postal_code: string;
    country: string;
    coordinates_lat: number | null;
    coordinates_lon: number | null;
    created_at: Date;
    updated_at: Date | null;
}
