import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsEmail,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { type WeekDay } from './me-settings.dto';

export class PatchProfileDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address?: CreateAddressDto;

    @IsOptional()
    @IsString()
    skills?: string;
}

export class PatchSecurityDto {
    @IsOptional()
    @IsBoolean()
    twoFactorEnabled?: boolean;
}

export class PatchSettingsDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => PatchProfileDto)
    profile?: PatchProfileDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => PatchSecurityDto)
    security?: PatchSecurityDto;

    @IsOptional()
    @IsObject()
    availability?: Partial<Record<WeekDay, boolean>>;
}
