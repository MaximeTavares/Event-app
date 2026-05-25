import type { Slot, SlotFromEventDetails } from '../../mission_slot/types/slot.type';

export type MissionStatus = 'OPEN' | 'FULL' | 'COMPLETED';

export const missionStatusLabel: Record<MissionStatus, string> = {
    OPEN: 'Ouvert',
    FULL: 'Complet',
    COMPLETED: 'Terminée',
};

export const missionStatusOptions: MissionStatus[] = ['OPEN', 'FULL', 'COMPLETED'];

export const MISSION_STATUS = ['OPEN', 'FULL', 'COMPLETED'] as const;

export const missionStatusColor: Record<MissionStatus, string> = {
    OPEN: 'badge-success',
    FULL: 'badge-neutral',
    COMPLETED: 'badge-warning',
};

export interface BaseMission {
    id: number;
    title: string;
    description: string;
    status: MissionStatus;
}

export interface Mission {
    id: number;
    title: string;
    description: string;
    status: MissionStatus;
    slot: Slot[];
}

export interface UpdateMissionInput {
    title?: string;
    description?: string;
    status?: MissionStatus;
}

export interface MissionFromEventDetails {
    id: number;
    title: string;
    description: string;
    status: MissionStatus;
    slots: SlotFromEventDetails[];
}

export type MissionDetailsApiResponse = {
    id: number;
    event_id: number;
    organizer_id: number | string;
    title: string;
    description: string;
    status: MissionStatus;
    slots: {
        id: number;
        start_at: Date;
        end_at: Date;
        max_participants: number;
        current_participants: number;
        available_place: number;
        status: 'OPEN' | 'FULL' | 'CLOSED' | 'CANCELLED';
        participations: {
            id: number;
            first_name: string;
            last_name: string;
        }[];
    }[];
};
