import { AddressDto } from "./address.types.js";
import { MissionDetailsDto, MissionDto, MissionStatus } from "./mission.type.js";
import { ParticipationStatus } from "./participant.types.js";
import { SlotDto, SlotStatus } from "./slot.types.js";

export type EventStatus = keyof typeof eventStatusLabel;

export const eventStatusOptions: EventStatus[] = ["OPEN", "CANCELLED", "DRAFT", "CLOSED"];

export const eventStatusLabel = {
	DRAFT: "Brouillon",
	OPEN: "Ouvert",
	CLOSED: "Fermé",
	CANCELLED: "Annulé",
} as const;

export const eventStatusColor: Record<EventStatus, string> = {
	OPEN: "badge-success",
	CLOSED: "badge-neutral",
	DRAFT: "badge-warning",
	CANCELLED: "badge-error",
};

export interface EventDto {
	id: number;
	organizer_id: number | string;
	title: string;
	description: string;
	program: string;
	start_date: Date;
	end_date: Date;
	address: AddressDto;
	status: EventStatus;
	missions: MissionDetailsDto[];
}

export interface EventWithAddress {
	id: number;
	organizer_id: number | string;
	title: string;
	description: string;
	program: string;
	start_date: Date;
	end_date: Date;
	status: EventStatus;
	address: AddressDto;
}

export class PaginatedEventsDto {
	items: EventWithAddress[];
	total: number;
	page: number;
	limit: number;
}

export interface EventMissionDto extends MissionDto {
	slots: SlotDto[];
}

export interface EventWithRelations {
	id: number;
	title: string;
	description: string;
	program: string;
	start_date: Date;
	end_date: Date;
	status: EventStatus;
	organizer_id: string;
	Address: AddressDto;
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
				user_id: string;
			}[];
		}[];
	}[];
}
