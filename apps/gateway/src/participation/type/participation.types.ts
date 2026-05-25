import { Participation_status } from '@prisma/client';

export type ParticipationWithStatusAndOrganizer = {
    userId: number;
    status: Participation_status;
    event: {
        organizerId: number;
    };
};
