import { Participation_status } from '@prisma/client';

export type ParticipationWithStatusAndOrganizer = {
    userId: string;
    status: Participation_status;
    event: {
        organizerId: string;
    };
};
