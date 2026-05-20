import {
	type EventDetails,
	type EventApiResponse,
	type UpdateEventInput,
	type CreateEventInput,
	type BaseEvent,
} from "../types/event.type";
import type { EventCreationFormValues } from "../validation/eventCreation.schema";
import type { EventUpdateFormValues } from "../validation/eventUpdate.schema";

export class EventMapper {
	static toEventDetails(dto: EventApiResponse): EventDetails {
		if (!dto.address) throw new Error("Event address is required");
		return {
			id: dto.id,
			title: dto.title,
			description: dto.description,
			program: dto.program,
			start_date: new Date(dto.start_date),
			end_date: new Date(dto.end_date),
			address: {
				street_name: dto.address.street_name,
				street_number: dto.address.street_number,
				address_line_2: dto.address.address_line_2,
				city: dto.address.city,
				country: dto.address.country,
				postal_code: dto.address.postal_code,
			},
			status: dto.status,
			user: dto.user,
		};
	}

	static toCreateEvent(data: EventCreationFormValues): CreateEventInput {
		return {
			title: data.title,
			description: data.description,
			program: data.program,
			start_date: data.start_date,
			end_date: data.end_date,
			status: data.status,
			address: data.address,
		};
	}

	static toUpdateEvent(data: EventUpdateFormValues): UpdateEventInput {
		return {
			title: data.title,
			description: data.description,
			program: data.program,
			start_date: data.start_date ?? undefined,
			end_date: data.end_date ?? undefined,
			status: data.status ? data.status : undefined,
			address: data.address ?? undefined,
		};
	}

	static toEvent(dto: EventApiResponse): BaseEvent {
		return {
			id: dto.id,
			title: dto.title,
			description: dto.description,
			program: dto.program,
			start_date: new Date(dto.start_date),
			end_date: new Date(dto.end_date),
			address: {
				street_name: dto.address.street_name,
				street_number: dto.address.street_number,
				address_line_2: dto.address.address_line_2,
				city: dto.address.city,
				country: dto.address.country,
				postal_code: dto.address.postal_code,
				coordinates: {
					lat: dto.address.coordinates_lat,
					lon: dto.address.coordinates_lon,
				},
			},
			status: dto.status,
			user: dto.user,
		};
	}
}
