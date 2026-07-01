import {
    ParticipantDetailsDto,
    participationStatusLabel,
    ParticipationStatus,
} from '@app/contracts';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flex } from '@/components/layout/flex';
import { cn } from '@/lib/utils';

// Couleurs sémantiques par statut, cohérentes avec le reste de l'app
const participationStatusColor: Record<ParticipationStatus, string> = {
    ACCEPTED: 'bg-green-100 text-green-800 border-green-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
    CANCELLED: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

type ParticipantItemProps = {
    participations: ParticipantDetailsDto[];
    canEdit: boolean;
    emptyMessage: string;
    className?: string;
};

export function ParticipantItem({
    participations,
    canEdit,
    emptyMessage,
    className,
}: Readonly<ParticipantItemProps>) {
    if (participations.length === 0) {
        return (
            <p className={cn('text-sm italic text-muted-foreground', className)}>{emptyMessage}</p>
        );
    }

    return (
        <ul className={cn('flex flex-col gap-2', className)}>
            {participations.map((p) => {
                const initials = [p.first_name, p.last_name]
                    .filter(Boolean)
                    .map((n) => n![0].toUpperCase())
                    .join('');

                return (
                    <li
                        key={p.id}
                        className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                        <Flex align="center" gap="3" className="min-w-0">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={p.avatar_url ?? undefined} />
                                <AvatarFallback className="text-xs">
                                    {initials || '?'}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-medium">
                                    {p.first_name}
                                    {canEdit && p.last_name && ` ${p.last_name}`}
                                </span>
                                {canEdit && (
                                    <span className="truncate text-xs text-muted-foreground">
                                        {p.email}
                                    </span>
                                )}
                            </div>
                        </Flex>

                        <Badge variant="outline" className={participationStatusColor[p.status]}>
                            {participationStatusLabel[p.status]}
                        </Badge>
                    </li>
                );
            })}
        </ul>
    );
}
