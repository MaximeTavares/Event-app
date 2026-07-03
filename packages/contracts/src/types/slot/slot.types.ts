import { ParticipantDetailsDto, ParticipationStatus } from "../participation/participant.types.js";

export const SLOT_STATUS = ["OPEN", "FULL", "CLOSED", "CANCELLED"] as const;
export type SlotStatus = (typeof SLOT_STATUS)[number];

export const slotStatusLabel: Record<SlotStatus, string> = {
	OPEN: "Ouvert",
	CANCELLED: "Annulé",
	CLOSED: "Fermé",
	FULL: "Complet",
};

export const slotStatusColor: Record<SlotStatus, string> = {
	OPEN: "bg-green-100 text-green-800 border-green-200",
	FULL: "bg-zinc-100 text-zinc-800 border-zinc-200",
	CANCELLED: "bg-red-100 text-red-800 border-red-200",
	CLOSED: "bg-red-100 text-red-800 border-red-200",
};

export interface SlotDomain {
	id: number;
	status: SlotStatus;
	created_at: Date;
	updated_at: Date | null;
	mission_id: number;
	start_at: Date;
	end_at: Date;
	max_participant: number;
}

export interface SlotDto {
	id: number;
	eventId: number;
	missionId: number;
	organizer_id: string;

	start_at: Date;
	end_at: Date;

	max_participant: number;
	current_participants: number;
	available_place: number;

	status: SlotStatus;

	is_participating: boolean;
	participation_status?: ParticipationStatus;
}

export interface SlotDetails extends SlotDto {
	participants: ParticipantDetailsDto[];
}
