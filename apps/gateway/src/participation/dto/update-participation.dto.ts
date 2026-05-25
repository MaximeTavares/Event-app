import { Participation_status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

export class UpdateParticipationDto {
    @IsEnum(Participation_status)
    status: Participation_status;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    cancelled_at: Date | null;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    decision_at: Date | null;
}
