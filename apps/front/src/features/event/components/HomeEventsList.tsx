import { CardEventImage } from '@/components/card-event-image';
import Pagination from '../../../shared/components/UI/Pagination';
import type { BaseEvent } from '../types/event.type';
import { Grid } from '@/components/layout/grid';
import { UiMessage } from '@/shared/utils/map/mapUiMessages';
import UiMessageAlert from '@/components/ui-message-alert';

type HomeEventsListProps = {
    listStatusMessage: UiMessage;
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

    if (listEvent.length === 0) {
        return <p>Aucun événement pour le moment... Vous pouvez cependant en créer un.</p>;
    }

    return (
        <>
            {listStatusMessage ? (
                <UiMessageAlert message={listStatusMessage} />
            ) : (
                <Grid cols={3}>
                    {listEvent.map((event) => (
                        <CardEventImage key={event.id} eventData={event} />
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
