export enum ParticipationStatusEnum {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}

export type ParticipationStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'CANCELLED';
export interface ParticipationDTO {
    id: number;
    user_id: string;
    slot_id: number;
    status: ParticipationStatus;
    decision_at: Date | null;
    cancelled_at: Date | null;
    created_at: Date;
    updated_at: Date | null;
}
