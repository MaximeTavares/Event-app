import { EventDto, EventWithAddress } from '@app/contracts';
import { EventDetailsQuery } from '../query/event-details.query';
import { EventWithAddressQuery } from '../query/event-address.query';

export function mapEvent(event: EventWithAddressQuery): EventWithAddress {
    return {
        id: event.id,
        organizer_id: event.organizer_id,
        title: event.title,
        description: event.description,
        program: event.program,
        start_date: event.start_date,
        end_date: event.end_date,
        status: event.status,
        address: event.Address,
    };
}

export function toEventDetails(
    event: EventDetailsQuery,
    currentUserId?: string,
): EventDto {
    return {
        id: event.id,
        organizer_id: event.organizer_id,
        title: event.title,
        description: event.description,
        program: event.program,
        start_date: event.start_date,
        end_date: event.end_date,
        status: event.status,
        address: event.Address,

        missions: event.Mission.map((m) => ({
            id: m.id,
            event_id: event.id,
            organizer_id: event.organizer_id,
            title: m.title,
            description: m.description,
            status: m.status,

            slots: m.Slot.map((s) => {
                const current_participants = s.Participation.filter(
                    (p) => p.status === 'ACCEPTED',
                ).length;

                const is_participating = s.Participation.some(
                    (p) => p.user_id === currentUserId,
                );

                const currentParticipation = s.Participation.find(
                    (p) => p.user_id === currentUserId,
                );

                return {
                    id: s.id,
                    organizer_id: event.organizer_id,
                    start_at: s.start_at,
                    end_at: s.end_at,
                    max_participants: s.max_participant,
                    status: s.status,
                    current_participants,
                    available_place: s.max_participant - current_participants,
                    is_participating,
                    participation_status: currentParticipation?.status,
                };
            }),
        })),
    };
}
