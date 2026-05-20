import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
    @IsString()
    street_number: string;

    @IsString()
    street_name: string;

    @IsOptional()
    @IsString()
    address_line_2?: string;

    @IsString()
    city: string;

    @IsString()
    postal_code: string;

    @IsString()
    country: string;
}
