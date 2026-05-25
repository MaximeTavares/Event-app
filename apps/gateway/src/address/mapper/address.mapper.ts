import { Address } from '@prisma/client';
import { AddressDTO } from '../dto/address.dto';
import { GeocodeDto } from 'src/geoapify/dto/geocode.dto';

export function mapAddress(address: Address | null): AddressDTO | null {
    if (!address) return null;
    return {
        id: address.id,
        street_number: address.street_number,
        street_name: address.street_name,
        address_line_2: address.address_line_2,
        city: address.city,
        postal_code: address.postal_code,
        country: address.country,
        coordinates:
            address.coordinates_lat && address.coordinates_lon
                ? {
                      lat: address.coordinates_lat,
                      lon: address.coordinates_lon,
                  }
                : undefined,
    };
}

/**
 * Transforme une adresse (Prisma ou DTO) vers le format Geoapify
 */
export function toGeocodeDto(address: {
    street_number: string;
    street_name: string;
    address_line_2?: string | null;
    city: string;
    postal_code: string;
    country: string;
}): GeocodeDto {
    return {
        street_number: address.street_number,
        street_name: address.street_name,
        address_line_2: address.address_line_2 ?? undefined,
        city: address.city,
        postal_code: address.postal_code,
        country: address.country,
    };
}
