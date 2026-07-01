import { SlotDto } from "../slot/slot.types.js";

// mission.type.ts
export const MISSION_STATUS = ["OPEN", "FULL", "COMPLETED"] as const;
export type MissionStatus = (typeof MISSION_STATUS)[number]; // dérivé du const, plus de duplication

export const missionStatusLabel: Record<MissionStatus, string> = {
	OPEN: "Ouvert",
	FULL: "Complet",
	COMPLETED: "Terminée",
};

export const missionStatusColor: Record<MissionStatus, string> = {
	OPEN: "bg-green-100 text-green-800 border-green-200",
	FULL: "bg-zinc-100 text-zinc-800 border-zinc-200",
	COMPLETED: "bg-amber-100 text-amber-800 border-amber-200",
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
