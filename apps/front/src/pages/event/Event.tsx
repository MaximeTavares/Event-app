import { useNavigate } from 'react-router';
import { useGetEvents } from '../../features/event/hooks/use_event.service';
import { useMe } from '../../features/auth/hooks/use_auth.service';
import { CardEventImage } from '@/components/card-event-image';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Grid } from '@/components/layout/grid';

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
            <Button variant="outline" size="sm" onClick={() => navigate('/events/create')}>
                <PlusIcon className="mr-1 h-4 w-4" />
                Créer un évènement
            </Button>
            <div className="p-4">
                <Grid cols={3}>
                    {myEvents?.map((event) => (
                        <CardEventImage key={event.id} eventData={event} />
                    ))}
                </Grid>
            </div>
        </div>
    );
}
