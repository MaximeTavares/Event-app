export type AddressDTO = {
    id: number;
    street_number: string;
    street_name: string;
    address_line_2?: string | null;
    city: string;
    postal_code: string;
    country: string;
    coordinates?: { lat: number; lon: number };
};
