import { Participation_status, Slot_status } from '@prisma/client';

export interface SlotDTO {
    id: number;
    start_at: Date;
    end_at: Date;
    max_participants: number;
    current_participants: number;
    available_place: number;
    status: Slot_status;
}

export interface SlotWithParticipations {
    id: number;
    mission_id: number;
    status: Slot_status;
    start_at: Date;
    end_at: Date;
    max_participant: number;
    Mission: {
        Event: {
            organizer_id: string;
        };
    };
    Participation: {
        id: number;
        status: Participation_status;
        user_id: string;
    }[];
}

export interface SlotWithParticipationDto {
    id: number;
    organizer_id: string;
    start_at: Date;
    end_at: Date;
    max_participants: number;
    current_participants: number;
    available_place: number;
    status: Slot_status;
    participants: {
        user_id: string;
        participation_id: number;
        first_name: string | null;
        last_name: string | null;
        email: string;
        avatar_url: string | null;
        participation_status: Participation_status;
    }[];
}
