import Button from '../../../shared/components/UI/Button';
import { formatDate } from '../../../shared/utils/formatDate';
import type { BaseEvent } from '../types/event.type';
import { GrMap, GrSchedule, GrFavorite } from 'react-icons/gr';
import { Link } from 'react-router';

interface IEventComponent {
    eventData: BaseEvent;
}

const EventCard = ({ eventData }: IEventComponent) => {
    return (
        <div className="card w-full bg-base-100 border border-base-300 shadow flex flex-col">
            <div className="card-body flex flex-col gap-3 items-start text-left">
                <div className="card-actions w-full justify-end">
                    <Button size="xs" circle disabled>
                        <GrFavorite className="size-4" />
                    </Button>
                </div>

                <h2 className="card-title">{eventData.title}</h2>

                <p className="wrap-break-word text-sm opacity-80">{eventData.description}</p>

                <div className="flex gap-2 text-sm">
                    <GrSchedule className="size-5 shrink-0" />
                    <span className="wrap-break-word">
                        Du {formatDate(eventData.start_date)} au {formatDate(eventData.end_date)}
                    </span>
                </div>

                <div className="flex gap-2 text-sm">
                    <GrMap className="size-5 shrink-0" />
                    <span className="wrap-break-word">
                        {eventData.address?.postal_code} {eventData.address?.city}
                    </span>
                </div>

                <div className="card-actions w-full justify-end mt-2">
                    <Button as={Link} to={`/events/${eventData.id}`} variant="primary">
                        Détails...{' '}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
