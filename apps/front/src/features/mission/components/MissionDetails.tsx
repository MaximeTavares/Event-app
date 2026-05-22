import { useState } from 'react';
import {
    missionStatusColor,
    missionStatusLabel,
    missionStatusOptions,
    type MissionDetailsApiResponse,
} from '../types/mission.type';
import { DeleteModal } from '../../../shared/components/UI/DeleteModal';
import { HeaderDetails } from '../../../shared/components/UI/HeaderDetails';
import { EditableField } from '../../../shared/components/UI/EditableField';
import { SlotItem } from '../../mission_slot/components/SlotItem';
import Button from '../../../shared/components/UI/Button';
import { Modal2 } from '../../../shared/components/UI/Modal2';
import { FormLayout } from '../../../shared/layout/FormLayout';
import { SlotCreationForm } from '../../mission_slot/components/SlotCreationForm';
import { useMissionDetails } from '../hooks/useMissionDetails';
import type { SlotCreationOutputValues } from '../../mission_slot/validation/SlotCreation.schema';
import { AddIcon } from '../../../shared/components/UI/icons/icons';

type MissionDetailsProps = {
    mission: MissionDetailsApiResponse;
};

export function MissionDetails({ mission }: Readonly<MissionDetailsProps>) {
    const [isCreateSlotModalOpen, setIsCreateSlotModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const { canEdit, handleDelete, handleSlotSubmit, updateField, createSlot } =
        useMissionDetails(mission);

    const onCreateSlot = async (data: SlotCreationOutputValues) => {
        setIsCreateSlotModalOpen(false);
        await handleSlotSubmit(data);
    };

    return (
        <>
            <div className="card bg-base-100 shadow p-4">
                {/* HEADER */}
                <HeaderDetails
                    key={mission.id}
                    entity={mission}
                    status={missionStatusLabel[mission.status]}
                    canEdit={canEdit}
                    statusColor={missionStatusColor}
                    onDelete={() => setIsDeleteModalOpen(true)}
                />

                <div className="divider" />

                {/* BODY WITH MISSION EDITABLES FIELDS */}

                <h2 className="text-xl font-semibold mb-2 text-primary">Titre</h2>

                <EditableField
                    canEdit={canEdit}
                    value={mission.title}
                    onSave={(newValue) => updateField('title', newValue)}
                />

                <h2 className="text-xl font-semibold mb-2 text-primary">Description</h2>

                <EditableField
                    canEdit={canEdit}
                    value={mission.description}
                    onSave={(newValue) => updateField('description', newValue)}
                />

                <h2 className="text-xl font-semibold mb-2 text-primary">Status</h2>

                <EditableField
                    canEdit={canEdit}
                    value={mission.status}
                    onSave={(newValue) => updateField('status', newValue)}
                    options={missionStatusOptions}
                    toDisplay={(v) => missionStatusLabel[v]}
                />

                <div>
                    <div className="flex">
                        <h2 className="text-xl font-semibold mb-2 text-primary">Créneaux</h2>
                        {canEdit && (
                            <Button
                                onClick={() => setIsCreateSlotModalOpen(true)}
                                variant="ghost"
                                size="xs"
                            >
                                <AddIcon size={20} />
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2 p-2">
                        {mission.slots.map((s) => (
                            <SlotItem key={s.id} slot={s} />
                        ))}
                    </div>
                </div>
            </div>

            {/* CREATE SLOT MODAL */}
            <Modal2
                isOpen={isCreateSlotModalOpen}
                size="lg"
                onClose={() => setIsCreateSlotModalOpen(false)}
            >
                <FormLayout title="Création de créneau">
                    <SlotCreationForm
                        onSubmit={onCreateSlot}
                        isSubmitting={createSlot.isPending}
                        error={createSlot.isError}
                    />
                </FormLayout>
            </Modal2>

            {/* DELETE MODAL */}
            <DeleteModal
                message="Voulez vous vraiment supprimer cette mission ?"
                size="sm"
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDelete}
            />
        </>
    );
}
