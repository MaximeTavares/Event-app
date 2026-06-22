import { Prisma } from '@app/db';

export const slotWithParticipationStatusQuery = {
    select: {
        id: true,
        mission_id: true,
        start_at: true,
        end_at: true,
        max_participant: true,
        status: true,
        Mission: {
            select: {
                Event: {
                    select: {
                        organizer_id: true,
                    },
                },
            },
        },
        Participation: {
            select: {
                id: true,
                user_id: true,
                status: true,
            },
        },
    },
} satisfies Prisma.SlotDefaultArgs;

export type SlotWithParticipationStatusQuery = Prisma.SlotGetPayload<
    typeof slotWithParticipationStatusQuery
>;
