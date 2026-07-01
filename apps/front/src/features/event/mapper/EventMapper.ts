import { format } from 'date-fns';
import {
    CreateEventInput,
    EventApiResponse,
    EventCreationFormValues,
    EventDto,
    EventWithAddress,
} from '@app/contracts';

export class EventMapper {
    // Conversion DTO API → objet interne avec dates typées
    static toEvent(dto: EventApiResponse): EventWithAddress {
        return {
            id: dto.id,
            title: dto.title,
            description: dto.description,
            program: dto.program,
            start_date: new Date(dto.start_date),
            end_date: new Date(dto.end_date),
            address: {
                street_name: dto.address.street_name,
                street_number: dto.address.street_number,
                address_line_2: dto.address.address_line_2,
                city: dto.address.city,
                country: dto.address.country,
                postal_code: dto.address.postal_code,
                coordinates: {
                    lat: dto.address.coordinates_lat,
                    lon: dto.address.coordinates_lon,
                },
            },
            status: dto.status,
            organizer_id: dto.organizer_id,
        };
    }

    // Conversion EventDto → valeurs par défaut pour EventForm (mode edit)
    // Les dates doivent être des strings "YYYY-MM-DD" pour les inputs type="date"
    static toFormValues(event: EventDto): EventCreationFormValues {
        return {
            title: event.title,
            description: event.description,
            program: event.program,
            start_date: format(new Date(event.start_date), 'yyyy-MM-dd'),
            end_date: format(new Date(event.end_date), 'yyyy-MM-dd'),
            status: event.status,
            address: {
                street_number: event.address.street_number,
                street_name: event.address.street_name,
                address_line_2: event.address.address_line_2 ?? '',
                city: event.address.city,
                postal_code: event.address.postal_code,
                country: event.address.country,
            },
        };
    }

    // Conversion valeurs du form → payload API création
    static toCreateEvent(data: EventCreationFormValues): CreateEventInput {
        return {
            title: data.title,
            description: data.description,
            program: data.program,
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status,
            address: data.address,
        };
    }
}
