import type { Participant } from "../../event/types/participant.type";
import type { ParticipationStatus } from "../../participation/types/participation.types";

export type SlotStatus = "OPEN" | "FULL" | "CLOSED" | "CANCELLED";

export const slotStatusLabel: Record<SlotStatus, string> = {
	OPEN: "Ouvert",
	CANCELLED: "Annulé",
	CLOSED: "Fermé",
	FULL: "Complet",
};

export const slotStatusColor: Record<SlotStatus, string> = {
	OPEN: "badge-success",
	FULL: "badge-accent",
	CANCELLED: "badge-error",
	CLOSED: "badge-error",
};

export interface Slot {
	id: number;
	start_at: Date;
	end_at: Date;
	max_participant: number;
	status: SlotStatus;
	participants: Participant[];
}

export interface BaseSlot {
	id: number;
	start_at: Date;
	end_at: Date;
	max_participant: number;
	status: SlotStatus;
}

export interface CreateSlotDto {
	start_at: string;
	end_at: string;
	max_participant: number;
}

export interface SlotFromEventDetails {
	id: number;
	start_at: Date;
	end_at: Date;
	max_participants: number;
	current_participants: number;
	available_place: number;
	status: SlotStatus;
}

export interface SlotDetailsApiResponse {
	id: number;
	organizer_id: number;
	start_at: Date;
	end_at: Date;
	current_participants: number;
	available_place: number;
	max_participants: number;
	status: SlotStatus;
	participants: [
		{
			id: number;
			participation_id: number;
			email: string;
			participation_status: ParticipationStatus;
			first_name: string;
			last_name: string;
		},
	];
}
