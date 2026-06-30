import { ParticipantDetailsDto, SlotDetails, SlotDto } from '@app/contracts';
import { SlotWithParticipationStatusQuery } from '../../query/SlotWithParticipationStatus.query';

export class SlotMapper {
    static toSlotWithParticipations(
        userId: string,
        slot: SlotWithParticipationStatusQuery,
        participants: ParticipantDetailsDto[],
        currentParticipants: number,
    ): SlotDetails {
        return {
            id: slot.id,
            eventId: slot.Mission.Event.id,
            missionId: slot.mission_id,
            organizer_id: slot.Mission.Event.organizer_id,
            start_at: slot.start_at,
            end_at: slot.end_at,
            current_participants: currentParticipants,
            available_place: slot.max_participant - currentParticipants,
            max_participant: slot.max_participant,
            status: slot.status,
            is_participating: slot.Participation.some(
                (p) => p.user_id === userId,
            ),
            participants: participants.map((participant) => ({
                user_id: participant.user_id,
                slot_id: slot.id,
                id: participant.id,
                status: participant.status,
                email: participant.email,
                first_name: participant.first_name ?? null,
                last_name: participant.last_name ?? null,
                avatar_url: participant.avatar_url ?? null,
            })),
        };
    }

    static toSlotDto(
        userId: string,
        slot: SlotWithParticipationStatusQuery,
        current_participants: number,
    ): SlotDto {
        const currentParticipation = slot.Participation.find(
            (p) => p.user_id === userId,
        );

        return {
            id: slot.id,
            eventId: slot.Mission.Event.id,
            missionId: slot.mission_id,
            organizer_id: slot.Mission.Event.organizer_id,
            start_at: slot.start_at,
            end_at: slot.end_at,
            max_participant: slot.max_participant,
            current_participants,
            available_place: slot.max_participant - current_participants,
            status: slot.status,
            is_participating: slot.Participation.some(
                (p) => p.user_id === userId,
            ),
            participation_status: currentParticipation?.status,
        };
    }
}
