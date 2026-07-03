import { ParticipationStatus } from '@app/contracts';

export interface ParticipationWithStatusAndOrganizer {
    userId: string;
    status: ParticipationStatus;
    slotId: number;
    event: {
        organizerId: string;
    };
}
