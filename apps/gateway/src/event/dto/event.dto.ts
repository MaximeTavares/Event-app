import {
    Address,
    Event_status,
    Mission_status,
    Participation_status,
    Slot_status,
} from '@prisma/client';

import { AddressDTO } from 'src/address/dto/address.dto';
import { MissionWithSlotDTO } from 'src/mission/dto/mission.dto';
import { UserDTO } from 'src/user/dto/user.dto';

export class EventDTO {
    id: number;
    user: UserDTO;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    address: AddressDTO | null;
    status: Event_status;
    created_at: Date;
    updated_at: Date | null;
}

export class EventWithUserAndAddressDTO {
    data: EventDTO & {
        address?: AddressDTO | null;
        user?: UserDTO | null;
    };
}

export class EventWithRelations {
    id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    status: Event_status;
    created_at: Date;
    updated_at: Date | null;
    user_id: number;
    Address: Address | null;
    Mission: {
        id: number;
        title: string;
        description: string;
        status: Mission_status;
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
    }[];
}

export type EventDetailsDTO = {
    id: number;
    organizer_id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    address: AddressDTO | null;
    status: Event_status;
    created_at: Date;
    updated_at: Date | null;
    missions: MissionWithSlotDTO[];
};

export class PaginatedEventsDTO {
    items: EventDTO[];
    total: number;
    page: number;
    limit: number;
}
