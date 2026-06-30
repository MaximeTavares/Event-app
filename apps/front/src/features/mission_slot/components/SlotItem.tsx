import { useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { Link } from 'react-router';
import { useParticipateMutation } from '../../participation/hooks/use_participation.service';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { ParticipationStatus, SlotDto, slotStatusColor, slotStatusLabel } from '@app/contracts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Flex } from '@/components/layout/flex';
import { UsersIcon, CalendarIcon } from 'lucide-react';

type SlotItemProps = {
    slot: SlotDto;
    eventId: number;
    missionId?: number;
};

const participationConfig: Record<
    ParticipationStatus | 'NONE',
    { label: string; disabled: boolean }
> = {
    NONE: { label: "S'inscrire", disabled: false },
    PENDING: { label: 'Demande en attente', disabled: true },
    ACCEPTED: { label: 'Déjà inscrit', disabled: true },
    REJECTED: { label: 'Demande rejetée', disabled: true },
    CANCELLED: { label: "S'inscrire", disabled: false },
};

export function SlotItem({ slot, eventId, missionId }: Readonly<SlotItemProps>) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const status = slot.participation_status ?? 'NONE';
    const config = participationConfig[status];

    const participationMutation = useParticipateMutation(slot.id, eventId, missionId);

    const handleParticipation = async () => {
        await toastMutation(participationMutation.mutateAsync(slot.id), {
            loading: 'Chargement...',
            success: 'Inscription prise en compte.',
            error: 'Une erreur est survenue, veuillez recommencer.',
        });
        setIsConfirmOpen(false);
    };

    return (
        <>
            <Card>
                <CardContent className="flex flex-col gap-3 pt-4">
                    {/* Statut */}
                    <Badge variant="outline" className={slotStatusColor[slot.status]}>
                        {slotStatusLabel[slot.status]}
                    </Badge>

                    {/* Horaires */}
                    <Flex align="center" gap="2" className="text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 shrink-0" />
                        <span>
                            {formatInTimeZone(slot.start_at, 'Europe/Paris', 'HH:mm')}
                            {' → '}
                            {formatInTimeZone(slot.end_at, 'Europe/Paris', 'HH:mm')}
                        </span>
                    </Flex>

                    {/* Participants */}
                    <Flex align="center" gap="2" className="text-sm text-muted-foreground">
                        <UsersIcon className="h-4 w-4 shrink-0" />
                        <span>
                            {slot.current_participants} inscrits · {slot.available_place} place
                            {slot.available_place > 1 ? 's' : ''} restante
                            {slot.available_place > 1 ? 's' : ''}
                        </span>
                    </Flex>

                    {/* Actions */}
                    <Flex justify="between" align="center" className="mt-1">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to={`/slots/${slot.id}`}>Voir le détail</Link>
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={config.disabled}
                        >
                            {config.label}
                        </Button>
                    </Flex>
                </CardContent>
            </Card>

            {/* Confirmation inscription */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer l'inscription</AlertDialogTitle>
                        <AlertDialogDescription>
                            Souhaitez-vous confirmer votre inscription sur ce créneau ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleParticipation}>
                            Confirmer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
