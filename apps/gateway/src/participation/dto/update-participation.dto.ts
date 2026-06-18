import { ParticipationStatus, ParticipationStatusEnum } from '@app/contracts';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';


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
