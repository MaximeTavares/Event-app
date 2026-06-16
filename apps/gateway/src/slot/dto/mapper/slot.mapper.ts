import {
    Slot,
    SlotDTO,
    SlotWithParticipationDto,
    SlotWithParticipations,
} from '../slot.dto';
import { ParticipantWithProfile } from 'src/slot/slot.service';

export class SlotMapper {
    static toSlotWithParticipations(
        slot: SlotWithParticipations,
        participants: ParticipantWithProfile[],
        currentParticipants: number,
    ): SlotWithParticipationDto {
        return {
            id: slot.id,
            organizer_id: slot.Mission.Event.organizer_id,
            start_at: slot.start_at,
            end_at: slot.end_at,
            current_participants: currentParticipants,
            available_place: slot.max_participant - currentParticipants,
            max_participants: slot.max_participant,
            status: slot.status,
            participants: participants.map((participant) => ({
                user_id: participant.userId,
                participation_id: participant.participation_id,
                participation_status: participant.participation_status,
                email: participant.email,
                first_name: participant.first_name ?? null,
                last_name: participant.last_name ?? null,
                avatar_url: participant.avatar_url ?? null,
            })),
        };
    }

    static MapSlot(
        slot: Omit<Slot, 'mission_id' | 'created_at' | 'updated_at'>,
        current_participants: number,
    ): SlotDTO {
        return {
            id: slot.id,
            start_at: slot.start_at,
            end_at: slot.end_at,
            max_participants: slot.max_participant,
            current_participants,
            available_place: slot.max_participant - current_participants,
            status: slot.status,
        };
    }
}
