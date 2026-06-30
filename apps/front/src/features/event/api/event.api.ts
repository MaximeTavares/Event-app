import type { EventFilters } from '../../../shared/components/UI/filter/eventsFilters.interface';
import {
    type UpdateEventInput,
    type BaseEvent,
    type PaginatedEventsApiResponse,
} from '../types/event.type';
import { api } from '../../../shared/utils/axios-client';
import { EventDto } from '@app/contracts';

import qs from 'qs';
import { EventCreationFormValues } from '../validation/eventCreation.schema';

export async function getEvents(filters?: EventFilters): Promise<PaginatedEventsApiResponse> {
    const { data } = await api.get<PaginatedEventsApiResponse>(`/events`, {
        params: filters,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    return data;
}

export async function getEventById(id: number) {
    const { data } = await api.get<EventDto>(`/events/${id}?details=true`);
    return data;
}

export async function createEvent(event: EventCreationFormValues): Promise<BaseEvent> {
    const { data } = await api.post<BaseEvent>(`/events`, event);

    return data;
}

export async function updateEvent(id: number, event: UpdateEventInput): Promise<BaseEvent> {
    const { data } = await api.patch<BaseEvent>(`/events/${id}`, event);

    return data;
}

export async function deleteEvent(id: number): Promise<void> {
    await api.delete(`/events/${id}`);
}
