import type { EventStatus } from '../../../../features/event/types/event.type';

export interface EventFilters {
    statuses?: EventStatus[];
    start_date?: string;
    end_date?: string;
    city?: string;
    distanceKm?: number;
    latitude?: number;
    longitude?: number;
    page?: number;
    limit?: number;
}
