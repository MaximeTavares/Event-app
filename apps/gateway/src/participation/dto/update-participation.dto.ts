import { ParticipationStatus, ParticipationStatusEnum } from '@app/contracts';
import { IsEnum } from 'class-validator';

export class UpdateParticipationDto {
    @IsEnum(ParticipationStatusEnum)
    toStatus: ParticipationStatus;
}
