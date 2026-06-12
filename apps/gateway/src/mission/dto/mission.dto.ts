import {
    Mission_status,
    Participation_status,
    Slot_status,
} from '@prisma/client';
import { SlotDTO } from 'src/slot/dto/slot.dto';

export interface MissionDTO {
    id: number;
    event_id: number;
    title: string;
    description: string;
    status: Mission_status;
    created_at: Date;
    updated_at?: Date | null;
}

export interface MissionWithSlotDTO {
    id: number;
    title: string;
    description: string;
    status: Mission_status;
    slots: SlotDTO[];
}

export interface MissionWithDetails {
    id: number;
    event_id: number;
    organizer_id: string;
    title: string;
    description: string;
    status: Mission_status;
    slots: SlotDTO[];
}

export interface MissionWithRelation {
    id: number;
    event_id: number;
    title: string;
    description: string;
    status: Mission_status;
    Event: {
        organizer_id: string;
    };
    Slot: {
        id: number;
        start_at: Date;
        end_at: Date;
        max_participant: number;
        status: Slot_status;
        Participation: {
            id: number;
            status: Participation_status;
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
