export type ParticipationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export type ParticipationFromSlotDetails = {
    id: number;
    participation_id: number;
    email: string;
    participation_status: ParticipationStatus;
    first_name: string;
    last_name: string;
}[];
