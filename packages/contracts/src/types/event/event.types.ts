import { AddressDto } from "../address/address.types.js";
import { MissionDetailsDto, MissionDto } from "../mission/mission.type.js";
import { SlotDto } from "../slot/slot.types.js";

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
