import { ParticipantDto } from '@app/contracts';
import { ParticipationQuery } from '../query/participation.query';

export class ParticipationMapper {
    static toParticipationDto(
        participationQuery: ParticipationQuery,
    ): ParticipantDto {
        return {
            id: participationQuery.id,
            slot_id: participationQuery.slot_id,
            status: participationQuery.status,
            user_id: participationQuery.user_id,
        };
    }
}
