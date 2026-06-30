import { SlotStatus } from '@app/contracts';
import type { ParticipationStatus } from '../../participation/types/participation.types';
export interface BaseSlot {
    id: number;
    start_at: Date;
    end_at: Date;
    max_participant: number;
    status: SlotStatus;
}

export interface SlotDetailsApiResponse {
    id: number;
    organizer_id: string;
    start_at: Date;
    end_at: Date;
    current_participants: number;
    available_place: number;
    max_participant: number;
    status: SlotStatus;
    participants: [
        {
            id: string;
            participation_id: number;
            email: string;
            participation_status: ParticipationStatus;
            first_name: string;
            last_name: string;
        },
    ];
}
