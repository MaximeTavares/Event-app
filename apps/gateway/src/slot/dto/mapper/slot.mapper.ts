import {
    ParticipantDetailsDto,
    SlotDetails,
    SlotDto,
    SlotWithParticipationsQuery,
    SlotWithUserIdQuery,
} from '@app/contracts';

export class SlotMapper {
    static toSlotWithParticipations(
        userId: string,
        slot: SlotWithParticipationsQuery,
        participants: ParticipantDetailsDto[],
        currentParticipants: number,
    ): SlotDetails {
        return {
            id: slot.id,
            organizer_id: slot.Mission.Event.organizer_id,
            start_at: slot.start_at,
            end_at: slot.end_at,
            current_participants: currentParticipants,
            available_place: slot.max_participant - currentParticipants,
            max_participants: slot.max_participant,
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
        slot: SlotWithUserIdQuery,
        current_participants: number,
    ): SlotDto {
        return {
            id: slot.id,
            organizer_id: slot.Mission.Event.organizer_id,
            start_at: slot.start_at,
            end_at: slot.end_at,
            max_participants: slot.max_participant,
            current_participants,
            available_place: slot.max_participant - current_participants,
            status: slot.status,
            is_participating: slot.Participation.some(
                (p) => p.user_id === userId,
            ),
        };
    }
}
