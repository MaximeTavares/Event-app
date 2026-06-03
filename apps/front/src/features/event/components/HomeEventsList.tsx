import Pagination from '../../../shared/components/UI/Pagination';
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

    return (
        <>
            {listStatusMessage ? (
                <div>{listStatusMessage}</div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                    {events.map((event) => (
                        <li key={event.id} className="w-full flex justify-center">
                            <EventCard eventData={event} />
                        </li>
                    ))}
                </ul>
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
