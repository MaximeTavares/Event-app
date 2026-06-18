import { ParticipationStatus } from "./participant.types.js";
import { SlotDto, SlotStatus } from "./slot.types.js";

export type MissionStatus = "OPEN" | "FULL" | "COMPLETED";

export const missionStatusLabel: Record<MissionStatus, string> = {
	OPEN: "Ouvert",
	FULL: "Complet",
	COMPLETED: "Terminée",
};

export const missionStatusOptions: MissionStatus[] = ["OPEN", "FULL", "COMPLETED"];

export const MISSION_STATUS = ["OPEN", "FULL", "COMPLETED"] as const;

export const missionStatusColor: Record<MissionStatus, string> = {
	OPEN: "badge-success",
	FULL: "badge-neutral",
	COMPLETED: "badge-warning",
};

export interface MissionQuery {
	id: number;
	event_id: number;
	title: string;
	description: string;
	status: MissionStatus;
	created_at: Date;
	updated_at: Date | null;
	Event: {
		organizer_id: string;
	};
}

export interface MissionDto {
	id: number;
	event_id: number;
	organizer_id: string;
	title: string;
	description: string;
	status: MissionStatus;
}

export interface MissionDetailsDto extends MissionDto {
	slots: SlotDto[];
}

export interface MissionDetailsQuery {
	id: number;
	event_id: number;
	title: string;
	description: string;
	status: MissionStatus;
	Event: {
		organizer_id: string;
	};
	Slot: {
		id: number;
		start_at: Date;
		end_at: Date;
		max_participant: number;
		status: SlotStatus;
		Participation: {
            id: number;
            user_id: string;
			status: ParticipationStatus;
		}[];
	}[];
}

// export interface MissionDetailsApiResponse extends MissionDto {
// 	event_id: number;
// 	organizer_id: string | number;

// 	slots: SlotDto[];
// }
