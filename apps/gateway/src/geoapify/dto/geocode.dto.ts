import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GeocodeDto {
    @IsOptional()
    @IsNumberString()
    street_number?: string;

    @IsOptional()
    @IsString()
    street_name?: string;

    @IsOptional()
    @IsString()
    address_line_2?: string;

    @IsOptional()
    @IsNumberString()
    postal_code?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    country?: string;
}
