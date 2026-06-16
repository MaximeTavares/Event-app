import { Address, AddressDTO } from 'src/address/dto/address.dto';
import { MissionStatus, MissionWithSlotDTO } from 'src/mission/dto/mission.dto';
import { ParticipationStatus } from 'src/participation/dto/participation.dto';
import { SlotStatus } from 'src/slot/dto/slot.dto';

export type EventStatus = 'OPEN' | 'CLOSED' | 'DRAFT' | 'CANCELLED';

export class EventDTO {
    id: number;
    organizer_id: string;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    address: AddressDTO | null;
    status: EventStatus;
    created_at: Date;
    updated_at: Date | null;
}

export class EventWithUserAndAddressDTO {
    data: EventDTO & {
        address?: AddressDTO | null;
        user?: any;
    };
}

export class EventWithRelations {
    id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    status: EventStatus;
    created_at: Date;
    updated_at: Date | null;
    organizer_id: string;
    Address: Address | null;
    Mission: {
        id: number;
        title: string;
        description: string;
        status: MissionStatus;
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
    }[];
}

export interface EventDetailsDTO {
    id: number;
    organizer_id: string;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    address: AddressDTO | null;
    status: EventStatus;
    created_at: Date;
    updated_at: Date | null;
    missions: MissionWithSlotDTO[];
}

export class PaginatedEventsDTO {
    items: EventDTO[];
    total: number;
    page: number;
    limit: number;
}
