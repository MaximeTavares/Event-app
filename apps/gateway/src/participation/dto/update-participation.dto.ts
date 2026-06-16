import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import {
    ParticipationStatus,
    ParticipationStatusEnum,
} from './participation.dto';

export class UpdateParticipationDto {
    @IsEnum(ParticipationStatusEnum)
    status: ParticipationStatus;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    cancelled_at: Date | null;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    decision_at: Date | null;
}
