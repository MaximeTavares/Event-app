import {
    IsOptional,
    IsString,
    ValidateNested,
    IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
    @IsOptional()
    @IsString()
    streetNumber?: string;

    @IsOptional()
    @IsString()
    streetName?: string;

    @IsOptional()
    @IsString()
    addressLine2?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsOptional()
    @IsString()
    country?: string;
}

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => AddressDto)
    address?: AddressDto;
}
