import { EventStatus } from '@app/contracts';
import type {
    Address,
    AddressForCreateEvent,
    AddressForUpdateEvent,
} from '../../address/types/address.type';



export interface BaseEvent {
    id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    organizer_id: string;
    address: Address | null;
    status: EventStatus;
}

export interface CreateEventInput {
    title: string;
    description: string;
    program: string;
    start_date: string;
    end_date: string;
    address: AddressForCreateEvent;
    status: EventStatus;
}

export interface UpdateEventInput {
    title?: string;
    description?: string;
    program?: string;
    start_date?: string;
    end_date?: string;
    address?: AddressForUpdateEvent;
    status?: EventStatus;
}

export interface EventApiResponse {
    id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    organizer_id: string;
    address: {
        street_name: string;
        street_number: string;
        address_line_2?: string;
        city: string;
        country: string;
        postal_code: string;
        coordinates_lat: number;
        coordinates_lon: number;
    };
    status: EventStatus;
}

export interface EventDetails {
    id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    organizer_id: string;
    address: {
        street_name: string;
        street_number: string;
        address_line_2?: string | null;
        city: string;
        country: string;
        postal_code: string;
    };
    status: EventStatus;
}

export interface EventDetailsApiResponse {
    id: number;
    organizer_id: number | string;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    address: {
        id: number;
        street_number: string;
        street_name: string;
        address_line_2?: string | null;
        city: string;
        postal_code: string;
        country: string;
    };
    status: EventStatus;
    created_at: Date;
    updated_at: Date | null;
    missions: {
        id: number;
        title: string;
        description: string;
        status: 'OPEN' | 'FULL' | 'COMPLETED';
        slots: {
            id: number;
            start_at: Date;
            end_at: Date;
            max_participant: number;
            current_participants: number;
            available_place: number;
            status: 'OPEN' | 'FULL' | 'CLOSED' | 'CANCELLED';
        }[];
    }[];
}

// Type pagination générique
export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

// Type attendu depuis le backend
export type PaginatedEventsApiResponse = Paginated<EventApiResponse>;

// type frontend paginé
export type PaginatedEvents = Paginated<BaseEvent>;
