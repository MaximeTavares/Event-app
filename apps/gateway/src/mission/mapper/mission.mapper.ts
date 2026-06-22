import { MissionDetailsDto, MissionDto } from '@app/contracts';
import { MissionDetailsQuery } from '../query/mission-details.query';
import { MissionQuery } from '../query/mission.query';

export function toMissionDto(mission: MissionQuery): MissionDto {
    return {
        id: mission.id,
        event_id: mission.event_id,
        organizer_id: mission.Event.organizer_id,
        title: mission.title,
        description: mission.description,
        status: mission.status,
    };
}

export function toMissionDetails(
    currentUserId: string,
    mission: MissionDetailsQuery,
): MissionDetailsDto {
    return {
        id: mission.id,
        event_id: mission.event_id,
        organizer_id: mission.Event.organizer_id,
        title: mission.title,
        description: mission.description,
        status: mission.status,

        slots: mission.Slot.map((s) => {
            const current_participants = s.Participation.filter(
                (p) => p.status === 'ACCEPTED',
            ).length;

            const is_participating = s.Participation.some(
                (p) => p.user_id === currentUserId,
            );

            const currentParticipation = s.Participation.find(
                (p) => p.user_id === currentUserId,
            );

            return {
                id: s.id,
                organizer_id: mission.Event.organizer_id,
                start_at: s.start_at,
                end_at: s.end_at,
                max_participants: s.max_participant,
                status: s.status,

                current_participants,
                available_place: s.max_participant - current_participants,
                is_participating,
                participation_status: currentParticipation?.status,
            };
        }),
    };
}
