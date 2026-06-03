import { useNavigate } from 'react-router';
import Button from '../../shared/components/UI/Button';
import { useGetEvents } from '../../features/event/hooks/use_event.service';
import { Grid } from '../../shared/layout/Grid';
import EventCard from '../../features/event/components/EventCard';
import { useMe } from '../../features/auth/hooks/use_auth.service';

export default function Event() {
    const navigate = useNavigate();

    const { data: user } = useMe();

    const { data } = useGetEvents();
    const events = data?.items;
    const myEvents = events
        ?.filter((e) => e.organizer_id === user?.id)
        .sort((a, b) => b.status.localeCompare(a.status));

    return (
        <div>
            <Button data-cy="create-event" onClick={() => navigate('/events/create')}>
                Créer un évènement
            </Button>
            <div className="p-4">
                <Grid>
                    {myEvents?.map((event) => (
                        <EventCard key={event.id} eventData={event} />
                    ))}
                </Grid>
            </div>
        </div>
    );
}
