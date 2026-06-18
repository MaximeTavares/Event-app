import { ParticipantDetailsDto, ParticipationStatus } from "./participant.types.js";

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
	organizer_id: string;

	start_at: Date;
	end_at: Date;

	max_participants: number;
	current_participants: number;
	available_place: number;

	status: SlotStatus;

	is_participating: boolean;
}

export interface SlotWithUserIdQuery {
	id: number;
	Mission: {
		Event: {
			organizer_id: string;
		};
	};
	mission_id: number;
	start_at: Date;
	end_at: Date;
	max_participant: number;
	status: SlotStatus;
	Participation: {
		user_id: string;
	}[];
}

export interface SlotDetails extends SlotDto {
	participants: ParticipantDetailsDto[];
}

export interface SlotWithParticipationsQuery {
	id: number;
	mission_id: number;
	status: SlotStatus;
	start_at: Date;
	end_at: Date;
	max_participant: number;
	Mission: {
		Event: {
			organizer_id: string;
		};
	};
	Participation: {
		id: number;
		status: ParticipationStatus;
		user_id: string;
	}[];
}
