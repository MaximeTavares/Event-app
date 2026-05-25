import { Prisma } from '@prisma/client';
import { eventWithAddressAndUser } from '../prisma/event.select';
import { EventDetailsDTO, EventDTO, EventWithRelations } from './event.dto';
import { mapUser } from 'src/user/mapper/user.mapper';

export type EventWithAddressAndUser = Prisma.EventGetPayload<{
    select: typeof eventWithAddressAndUser;
}>;

export function mapEvent(event: EventWithAddressAndUser): EventDTO {
    return {
        id: event.id,
        title: event.title,
        description: event.description,
        program: event.program,
        start_date: event.start_date,
        end_date: event.end_date,
        status: event.status,
        created_at: event.created_at,
        updated_at: event.updated_at,
        address: event.Address,
        user: mapUser(event.User),
    };
}

export function toEventDetails(event: EventWithRelations): EventDetailsDTO {
    return {
        id: event.id,
        organizer_id: event.user_id,
        title: event.title,
        description: event.description,
        program: event.program,
        start_date: event.start_date,
        end_date: event.end_date,
        status: event.status,
        created_at: event.created_at,
        updated_at: event.updated_at,
        address: event.Address,
        missions: event.Mission.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            status: m.status,
            slots: m.Slot.map((s) => ({
                id: s.id,
                start_at: s.start_at,
                end_at: s.end_at,
                max_participants: s.max_participant,
                status: s.status,
                current_participants: s.Participation.length,
                available_place: s.max_participant - s.Participation.length,
                participations: s.Participation.map((p) => ({
                    id: p.User.id,
                    first_name: p.User.User_profile?.first_name,
                    last_name: p.User.User_profile?.last_name,
                })),
            })),
        })),
    };
}
