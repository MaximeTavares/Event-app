import { Participation_status } from '@prisma/client';

export interface ParticipationWithStatusAndOrganizer {
    userId: string;
    status: Participation_status;
    event: {
        organizerId: string;
    };
}
