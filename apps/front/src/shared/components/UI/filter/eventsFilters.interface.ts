import { EventStatus } from '@app/contracts';

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
