import { ParticipationStatus } from '../../participation/dto/participation.dto';
import { SlotDTO, SlotStatus } from '../../slot/dto/slot.dto';

export type MissionStatus = 'OPEN' | 'FULL' | 'COMPLETED';

export interface MissionDTO {
    id: number;
    event_id: number;
    title: string;
    description: string;
    status: MissionStatus;
    created_at: Date;
    updated_at?: Date | null;
}

export interface MissionWithSlotDTO {
    id: number;
    title: string;
    description: string;
    status: MissionStatus;
    slots: SlotDTO[];
}

export interface MissionWithDetails {
    id: number;
    event_id: number;
    organizer_id: string;
    title: string;
    description: string;
    status: MissionStatus;
    slots: SlotDTO[];
}

export interface MissionWithRelation {
    id: number;
    event_id: number;
    title: string;
    description: string;
    status: MissionStatus;
    Event: {
        organizer_id: string;
    };
    Slot: {
        id: number;
        start_at: Date;
        end_at: Date;
        max_participant: number;
        status: SlotStatus;
        Participation: {
            id: number;
            status: ParticipationStatus;
            // User: {
            //     id: string;
            //     email: string;
            //     User_profile: {
            //         first_name: string | null;
            //         last_name: string | null;
            //     } | null;
            // };
        }[];
    }[];
}
