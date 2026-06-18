import { formatInTimeZone } from 'date-fns-tz';
import { Link } from 'react-router';
import Button from '../../../shared/components/UI/Button';
import { useState } from 'react';
import { ConfirmModal } from '../../../shared/components/UI/ConfirmModal';
import { useParticipateMutation } from '../../participation/use_participation.service';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { SlotDto, slotStatusColor, slotStatusLabel } from '@app/contracts';

type SlotItemProps = {
    slot: SlotDto;
    eventId: number;
    missionId?: number;
};

export function SlotItem({ slot, eventId, missionId }: Readonly<SlotItemProps>) {
    const [isSlotParticipationOpen, setIsSlotParticipationOpen] = useState<boolean>(false);

    const participationMutation = useParticipateMutation(eventId, missionId);

    const handleParticipation = async () => {
        await toastMutation(participationMutation.mutateAsync(slot.id), {
            loading: 'Chargement...',
            success: 'Inscription prise en compte',
            error: 'Une erreur est survenue, veuillez recommencer.',
        });

        setIsSlotParticipationOpen(false);
    };

    return (
        <div className="p-2 border border-primary rounded-md">
            <span className={`badge ${slotStatusColor[slot.status]}`}>
                {slotStatusLabel[slot.status]}
            </span>

            <p className="mt-1 text-sm">
                De {formatInTimeZone(slot.start_at, 'Europe/Paris', 'HH:mm')} à{' '}
                {formatInTimeZone(slot.end_at, 'Europe/Paris', 'HH:mm')}
            </p>

            <p className="text-sm text-gray-500">
                {slot.current_participants} inscrits · {slot.available_place} places restantes
            </p>

            <div className="card-actions w-full justify-between mt-2">
                <Button size="sm" as={Link} to={`/slots/${slot.id}`} variant="ghost">
                    Voir
                </Button>

                {slot.is_participating ? (
                    <Button size="sm" variant="primary" disabled>
                        Déjà inscrit
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setIsSlotParticipationOpen(true)}
                    >
                        S'inscrire
                    </Button>
                )}
            </div>
            {/* PARTICIPATION MODAL */}

            <ConfirmModal
                key={slot.id}
                message="Souhaitez vous confirmer votre inscription sur ce créneau ?"
                onConfirm={handleParticipation}
                isOpen={isSlotParticipationOpen}
                size="md"
                onClose={() => setIsSlotParticipationOpen(false)}
            ></ConfirmModal>
        </div>
    );
}
