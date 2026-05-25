import { Slot } from '@prisma/client';
import {
    SlotDTO,
    SlotWithParticipationDto,
    SlotWithParticipations,
} from '../slot.dto';

export class SlotMapper {
    static toSlotWithParticipations(
        slot: SlotWithParticipations,
        current_participants: number,
    ): SlotWithParticipationDto {
        return {
            id: slot.id,
            organizer_id: slot.Mission.Event.user_id,
            start_at: slot.start_at,
            end_at: slot.end_at,
            current_participants,
            available_place: slot.max_participant - current_participants,
            max_participants: slot.max_participant,
            status: slot.status,
            participants: slot.Participation.map((p) => ({
                id: p.id,
                participation_id: p.id,
                email: p.User.email,
                participation_status: p.status,
                first_name: p.User.User_profile?.first_name ?? null,
                last_name: p.User.User_profile?.last_name ?? null,
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
