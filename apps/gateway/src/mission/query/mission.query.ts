import { Prisma } from '@app/db';

export const missionQuery = {
    select: {
        id: true,
        event_id: true,
        title: true,
        description: true,
        status: true,
        created_at: true,
        updated_at: true,
        Event: {
            select: {
                organizer_id: true,
            },
        },
    },
} satisfies Prisma.MissionDefaultArgs;

export type MissionQuery = Prisma.MissionGetPayload<typeof missionQuery>;
