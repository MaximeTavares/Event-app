import { Transform, Type } from 'class-transformer';
import { IsOptional, IsArray, IsString, IsNumber } from 'class-validator';
import { EventStatus } from './event.dto';

export class EventFiltersDto {
    @IsOptional()
    @Transform(({ value }: { value: unknown }): EventStatus[] | undefined => {
        if (value == null) return undefined;
        return (Array.isArray(value) ? value : [value]) as EventStatus[];
    })
    @IsArray()
    statuses?: EventStatus[];

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
