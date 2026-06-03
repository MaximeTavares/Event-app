import Pagination from '../../../shared/components/UI/Pagination';
import { Grid } from '../../../shared/layout/Grid';
import type { BaseEvent } from '../types/event.type';
import EventCard from './EventCard';

type HomeEventsListProps = {
    listStatusMessage: string | null;
    events: BaseEvent[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function HomeEventsList({
    listStatusMessage,
    events,
    currentPage,
    totalPages,
    onPageChange,
}: Readonly<HomeEventsListProps>) {
    const hasEvents = events.length > 0;

    const listEvent = events.filter((e) => e.status === 'OPEN');

    return (
        <>
            {listStatusMessage ? (
                <div>{listStatusMessage}</div>
            ) : (
                <Grid>
                    {listEvent.map((event) => (
                        <EventCard key={event.id} eventData={event} />
                    ))}
                </Grid>
            )}

            {hasEvents && totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </>
    );
}
