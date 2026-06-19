import { Prisma } from '@app/db';

export const missionDetailsQuery = {
    select: {
        id: true,
        event_id: true,
        title: true,
        description: true,
        status: true,
        Event: { select: { organizer_id: true } },
        Slot: {
            select: {
                id: true,
                start_at: true,
                end_at: true,
                max_participant: true,
                status: true,
                Participation: {
                    select: {
                        id: true,
                        status: true,
                        user_id: true,
                    },
                },
            },
        },
    },
} satisfies Prisma.MissionDefaultArgs;

export type MissionDetailsQuery = Prisma.MissionGetPayload<
    typeof missionDetailsQuery
>;
