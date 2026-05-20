import { Participation_status } from 'prisma/generated/prisma/enums';

export type ParticipationWithStatusAndOrganizer = {
    userId: number;
    status: Participation_status;
    event: {
        organizerId: number;
    };
};
