import { Event_status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsArray, IsString, IsNumber } from 'class-validator';

export class EventFiltersDto {
    @IsOptional()
    @Transform(({ value }: { value: unknown }): Event_status[] | undefined => {
        if (value == null) return undefined;
        return (Array.isArray(value) ? value : [value]) as Event_status[];
    })
    @IsArray()
    statuses?: Event_status[];

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    startDate?: string;

    @IsOptional()
    endDate?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    latitude?: number;

    @IsOptional()
    @Type(() => Number)
    longitude?: number;

    @IsOptional()
    @Type(() => Number)
    distanceKm?: number;
}
