import { Type } from 'class-transformer';
import {
    IsDateString,
    IsEnum,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Event_status } from 'prisma/generated/prisma/enums';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';

export class CreateEventDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    program: string;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;

    @IsEnum(Event_status)
    status: Event_status;

    @ValidateNested()
    @Type(() => CreateAddressDto)
    address: CreateAddressDto;
}
