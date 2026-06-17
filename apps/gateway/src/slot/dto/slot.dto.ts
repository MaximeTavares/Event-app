import { ParticipationStatus } from '../../participation/dto/participation.dto';

export type SlotStatus = 'OPEN' | 'FULL' | 'CLOSED' | 'CANCELLED';

export interface Slot {
    id: number;
    mission_id: number;
    start_at: Date;
    end_at: Date;
    max_participant: number;
    status: SlotStatus;
    created_at: Date;
    updated_at: Date | null;
}

export interface SlotDTO {
    id: number;
    start_at: Date;
    end_at: Date;
    max_participants: number;
    current_participants: number;
    available_place: number;
    status: SlotStatus;
}

export interface SlotWithParticipations {
    id: number;
    mission_id: number;
    status: SlotStatus;
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
        status: ParticipationStatus;
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
