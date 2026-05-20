import type { EventFilters } from "../../../shared/components/UI/filter/eventsFilters.interface";
import {
	type CreateEventInput,
	type UpdateEventInput,
	type BaseEvent,
	type EventDetailsApiResponse,
	type PaginatedEventsApiResponse,
} from "../types/event.type";
import { api } from "../../../shared/utils/axios-client";

export async function getEvents(filters?: EventFilters): Promise<PaginatedEventsApiResponse> {
	const { data } = await api.get<PaginatedEventsApiResponse>(`/events`, {
		params: filters,
	});

	return data;
}

export async function getEventById(id: number): Promise<EventDetailsApiResponse> {
	const { data } = await api.get<EventDetailsApiResponse>(`/events/${id}?details=true`);

	console.log("🚀 ~ getEventById ~ data:", data);
	return data;
}

export async function createEvent(event: CreateEventInput): Promise<BaseEvent> {
	const { data } = await api.post(`/events`, event);

	return data;
}

export async function updateEvent(id: number, event: UpdateEventInput): Promise<BaseEvent> {
	const { data } = await api.patch(`/events/${id}`, event);

	return data;
}

export async function deleteEvent(id: number): Promise<void> {
	await api.delete(`/events/${id}`);
}
