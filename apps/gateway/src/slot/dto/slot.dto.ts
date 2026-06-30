import { ParticipationStatus, SlotStatus } from '@app/contracts';

export interface SlotWithParticipationDto {
    id: number;
    organizer_id: string;
    start_at: Date;
    end_at: Date;
    max_participant: number;
    current_participants: number;
    available_place: number;
    status: SlotStatus;
    participants: {
        user_id: string;
        participation_id: number;
        first_name: string | null;
        last_name: string | null;
        email: string;
        avatar_url: string | null;
        participation_status: ParticipationStatus;
    }[];
}
