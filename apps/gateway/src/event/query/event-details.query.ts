import { Prisma } from '@app/db';

export const eventDetailsQuery = {
    select: {
        id: true,
        title: true,
        description: true,
        program: true,
        start_date: true,
        end_date: true,
        status: true,
        organizer_id: true,
        Address: true,
        Mission: {
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
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
                                user_id: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        },
    },
} satisfies Prisma.EventDefaultArgs;

export type EventDetailsQuery = Prisma.EventGetPayload<
    typeof eventDetailsQuery
>;
