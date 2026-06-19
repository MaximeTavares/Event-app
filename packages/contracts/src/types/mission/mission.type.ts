import { SlotDto } from "../slot/slot.types.js";

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