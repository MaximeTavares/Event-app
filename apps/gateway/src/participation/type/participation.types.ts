import { ParticipationStatus } from '@app/contracts';

export interface ParticipationWithStatusAndOrganizer {
    userId: string;
    status: ParticipationStatus;
    event: {
        organizerId: string;
    };
}
