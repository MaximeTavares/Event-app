import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BaseEvent } from '@/features/event/types/event.type';
import { formatDate } from '@/shared/utils/formatDate';
import { eventStatusColor, eventStatusLabel } from '@app/contracts';
import { GrMap, GrSchedule } from 'react-icons/gr';
import { useNavigate } from 'react-router';

interface CardEventImageProps {
    eventData: BaseEvent;
}

export function CardEventImage({ eventData }: Readonly<CardEventImageProps>) {
    const navigate = useNavigate();
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src="https://avatar.vercel.sh/shadcn1"
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary" className={eventStatusColor[eventData.status]}>
                        {eventStatusLabel[eventData.status]}
                    </Badge>
                </CardAction>

                <CardTitle>{eventData.title}</CardTitle>

                <CardDescription>{eventData.description}</CardDescription>

                <CardContent className="p-4">
                    <div className="flex gap-2 text-sm">
                        <GrSchedule className="size-5 shrink-0" />
                        <span className="wrap-break-word">
                            Du {formatDate(eventData.start_date)} au{' '}
                            {formatDate(eventData.end_date)}
                        </span>
                    </div>

                    <div className="flex gap-2 text-sm mt-3">
                        <GrMap className="size-5 shrink-0" />
                        <span className="wrap-break-word">
                            {eventData.address?.postal_code} {eventData.address?.city}
                        </span>
                    </div>
                </CardContent>
            </CardHeader>

            <CardFooter>
                <Button onClick={() => navigate(`/events/${eventData.id}`)} className="w-full">
                    Détails...
                </Button>
            </CardFooter>
        </Card>
    );
}
