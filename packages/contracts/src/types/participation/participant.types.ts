export enum ParticipationStatusEnum {
	PENDING = "PENDING",
	ACCEPTED = "ACCEPTED",
	REJECTED = "REJECTED",
	CANCELLED = "CANCELLED",
}

export const participationStatusLabel: Record<ParticipationStatus, string> = {
	ACCEPTED: "Accepté",
	PENDING: "En attente",
	REJECTED: "Rejeté",
	CANCELLED: "Annulé",
};

export type ParticipationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export interface ParticipantDto {
	id: number;
	user_id: string;
	slot_id: number;
	status: ParticipationStatus;
}

export interface ParticipantDetailsDto extends ParticipantDto {
	email: string;
	first_name: string | null;
	last_name: string | null;
	avatar_url: string | null;
}
