import { AddressDto } from "../address/address.types.js";
import { MissionDetailsDto, MissionDto } from "../mission/mission.type.js";
import { SlotDto } from "../slot/slot.types.js";

export const EVENT_STATUS = ["OPEN", "CANCELLED", "DRAFT", "CLOSED"] as const;
export type EventStatus = (typeof EVENT_STATUS)[number];

export const eventStatusOptions: EventStatus[] = ["OPEN", "CANCELLED", "DRAFT", "CLOSED"];

export const eventStatusLabel: Record<EventStatus, string> = {
	DRAFT: "Brouillon",
	OPEN: "Ouvert",
	CLOSED: "Fermé",
	CANCELLED: "Annulé",
};

export const eventStatusColor: Record<EventStatus, string> = {
	OPEN: "bg-green-100 text-green-800 border-green-200",
	CLOSED: "bg-zinc-100 text-zinc-800 border-zinc-200",
	DRAFT: "bg-amber-100 text-amber-800 border-amber-200",
	CANCELLED: "bg-red-100 text-red-800 border-red-200",
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
