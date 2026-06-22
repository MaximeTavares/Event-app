import { Prisma } from '@app/db';

export const eventWithAddressQuery = {
    select: {
        id: true,
        organizer_id: true,
        title: true,
        description: true,
        program: true,
        start_date: true,
        end_date: true,
        status: true,
        Address: {
            select: {
                id: true,
                street_number: true,
                street_name: true,
                address_line_2: true,
                city: true,
                postal_code: true,
                country: true,
                coordinates_lat: true,
                coordinates_lon: true,
            },
        },
    },
} satisfies Prisma.EventDefaultArgs;

export type EventWithAddressQuery = Prisma.EventGetPayload<
    typeof eventWithAddressQuery
>;
