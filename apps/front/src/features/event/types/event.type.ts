import type {
    Address,
    AddressForCreateEvent,
    AddressForUpdateEvent,
} from '../../address/types/address.type';
import type { User } from '../../user/types/user.type';
import type { UserWithProfileAndAddress } from '../../user_profile/types/types';

export interface Event {
    id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    user?: UserWithProfileAndAddress;
    address: Address | null;
    status: EventStatus;
}

export interface BaseEvent {
    id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    user?: User;
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

export type EventStatus = keyof typeof eventStatusLabel;

export const eventStatusOptions: EventStatus[] = ['OPEN', 'CANCELLED', 'DRAFT', 'CLOSED'];

export const eventStatusLabel = {
    DRAFT: 'Brouillon',
    OPEN: 'Ouvert',
    CLOSED: 'Fermé',
    CANCELLED: 'Annulé',
} as const;

export const eventStatusColor: Record<EventStatus, string> = {
    OPEN: 'badge-success',
    CLOSED: 'badge-neutral',
    DRAFT: 'badge-warning',
    CANCELLED: 'badge-error',
};

export interface EventApiResponse {
    id: number;
    title: string;
    description: string;
    program: string;
    start_date: Date;
    end_date: Date;
    user: User;
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
    user: User;
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
            max_participants: number;
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
