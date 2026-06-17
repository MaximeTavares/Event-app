import { formatInTimeZone } from 'date-fns-tz';
import { slotStatusColor, slotStatusLabel, type SlotFromEventDetails } from '../types/slot.type';
import { Link } from 'react-router';
import Button from '../../../shared/components/UI/Button';
import { useState } from 'react';
import { Modal2 } from '../../../shared/components/UI/Modal2';
import { Card } from '../../../shared/layout/Card';

type SlotItemProps = {
    slot: SlotFromEventDetails;
};

export function SlotItem({ slot }: Readonly<SlotItemProps>) {
    const [isSlotParticipationOpen, setIsSlotParticipationOpen] = useState<boolean>(false);

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

                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setIsSlotParticipationOpen(true)}
                >
                    S'inscrire
                </Button>
            </div>
            {/* PARTICIPATION MODAL */}

            <Modal2
                isOpen={isSlotParticipationOpen}
                size="lg"
                onClose={() => setIsSlotParticipationOpen(false)}
            >
                <Card title="Test">Test</Card>
            </Modal2>
        </div>
    );
}
