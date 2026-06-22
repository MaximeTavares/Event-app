import { Prisma } from '@app/db';

export const participationQuery = {
    select: {
        id: true,
        slot_id: true,
        user_id: true,
        status: true,
    },
} satisfies Prisma.ParticipationDefaultArgs;

export type ParticipationQuery = Prisma.ParticipationGetPayload<
    typeof participationQuery
>;
