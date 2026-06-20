import { formatInTimeZone } from 'date-fns-tz';
import { ParticipantItem } from '../../participation/components/ParticipantItem';
import { HeaderDetails } from '../../../shared/components/UI/HeaderDetails';
import { DeleteModal } from '../../../shared/components/UI/DeleteModal';
import { useState } from 'react';
import { SlotCreationForm } from './SlotCreationForm';
import { useSlotDetails } from '../hooks/useSlotDetails';
import type { SlotCreationOutputValues } from '../validation/SlotCreation.schema';
import { SlotMapper } from '../mapper/SlotMapper';
import { Modal2 } from '../../../shared/components/UI/Modal2';
import { Card } from '../../../shared/layout/Card';
import { SlotDetails, slotStatusColor, slotStatusLabel } from '@app/contracts';
import { HandleParticipantItem } from '../../participation/components/HandleParticipantItem';
import {
    TransitionAction,
    useParticipationTransitions,
} from '../../participation/hooks/use_participationTransition';

type SlotDetailsProps = {
    slot: SlotDetails;
};

export function SlotDetailsComponent({ slot }: Readonly<SlotDetailsProps>) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isParticipantModalOpen, setIsParticipantModalOpen] = useState<boolean>(false);
    const isFull = slot.available_place === 0;

    const {
        acceptedParticipants,
        pendingParticipants,
        canEdit,
        handleDelete,
        handleUpdate,
        updateSlotMutation,
    } = useSlotDetails(slot);

    const onUpdate = async (data: SlotCreationOutputValues) => {
        setIsEditModalOpen(false);
        await handleUpdate(data);
    };

    const { /* isPending, */ handleAction } = useParticipationTransitions(slot.id);

    const onParticipantAction = async (action: TransitionAction, participationId: number) => {
        setIsParticipantModalOpen(false);
        await handleAction(action, participationId);
    };

    return (
        <>
            <div className="card bg-base-100 shadow p-4">
                {/* HEADER */}
                <HeaderDetails
                    key={slot.id}
                    entity={slot}
                    status={slotStatusLabel[slot.status]}
                    canEdit={canEdit}
                    statusColor={slotStatusColor}
                    onEdit={() => setIsEditModalOpen(true)}
                    onDelete={() => setIsDeleteModalOpen(true)}
                />

                <div className="divider" />

                <h2 className="text-xl font-semibold mb-2 text-primary">Début</h2>
                <p>{formatInTimeZone(slot.start_at, 'Europe/Paris', 'dd/MM/yyyy à HH:mm')}</p>

                <h2 className="text-xl font-semibold mb-2 text-primary">Fin</h2>
                <p>{formatInTimeZone(slot.end_at, 'Europe/Paris', 'dd/MM/yyyy à HH:mm')}</p>

                <h2 className="text-xl font-semibold mb-2 text-primary">
                    Nombre maximum de participants
                </h2>
                <p>{slot.max_participants}</p>

                <h2 className="text-xl font-semibold mb-2 text-primary">Places restantes</h2>
                <p>{slot.available_place}</p>

                <h2 className="text-xl font-semibold mb-2 text-primary">Participants actuels</h2>
                <ParticipantItem
                    participations={acceptedParticipants}
                    canEdit={canEdit}
                    emptyMessage="Aucun participant"
                />

                {canEdit && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-primary">
                            Demandes en attente
                        </h2>
                        <ParticipantItem
                            participations={pendingParticipants}
                            canEdit={canEdit}
                            emptyMessage="Aucune participation en attente"
                        />
                    </div>
                )}

                {canEdit && (
                    <div className="pt-2">
                        <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => setIsParticipantModalOpen(true)}
                        >
                            Gérer les participants
                        </button>
                    </div>
                )}
            </div>

            {/*  MODAL PARTICIPANTS */}
            <Modal2
                isOpen={isParticipantModalOpen}
                onClose={() => setIsParticipantModalOpen(false)}
                size="md"
                title="Gestion des participants"
            >
                <HandleParticipantItem
                    participations={slot.participants}
                    isFull={isFull}
                    onAction={onParticipantAction}
                />
            </Modal2>

            {/* EDIT MODAL */}
            <Modal2 isOpen={isEditModalOpen} size="lg" onClose={() => setIsEditModalOpen(false)}>
                <Card title="Modification de créneau" size="full">
                    <SlotCreationForm
                        onSubmit={onUpdate}
                        isSubmitting={updateSlotMutation.isPending}
                        error={updateSlotMutation.isError}
                        defaultValues={SlotMapper.toDefaultValues(slot)}
                    />
                </Card>
            </Modal2>

            {/* DELETE MODAL */}
            <DeleteModal
                message="Voulez vous vraiment supprimer ce créneau ?"
                size="sm"
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDelete}
            />
        </>
    );
}
