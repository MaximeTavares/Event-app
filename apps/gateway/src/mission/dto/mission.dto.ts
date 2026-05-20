import {
    Mission_status,
    Participation_status,
    Slot_status,
} from 'prisma/generated/prisma/enums';
import { SlotDTO } from 'src/slot/dto/slot.dto';

export type MissionDTO = {
    id: number;
    event_id: number;
    title: string;
    description: string;
    status: Mission_status;
    created_at: Date;
    updated_at?: Date | null;
};

export type MissionWithSlotDTO = {
    id: number;
    title: string;
    description: string;
    status: Mission_status;
    slots: SlotDTO[];
};

export type MissionWithDetails = {
    id: number;
    event_id: number;
    organizer_id: number;
    title: string;
    description: string;
    status: Mission_status;
    slots: SlotDTO[];
};

export type MissionWithRelation = {
    id: number;
    event_id: number;
    title: string;
    description: string;
    status: Mission_status;
    Event: {
        user_id: number;
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
            User: {
                id: number;
                email: string;
                User_profile: {
                    first_name: string | null;
                    last_name: string | null;
                } | null;
            };
        }[];
    }[];
};
