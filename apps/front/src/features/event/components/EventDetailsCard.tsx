import { useState } from 'react';
import { Modal2 } from '../../../shared/components/UI/Modal2';
import { formatDate } from '../../../shared/utils/formatDate';
import { useAuthStore } from '../../auth/store/auth.store';
import {
    eventStatusColor,
    eventStatusLabel,
    type EventDetailsApiResponse,
} from '../types/event.type';
import { FormLayout } from '../../../shared/layout/FormLayout';
import { EventUpdateForm } from './EventUpdateForm';
import { useNavigate } from 'react-router';
import { useDeleteEvent, useUpdateEvent } from '../hooks/use_event.service';
import type { EventUpdateFormValues } from '../validation/eventUpdate.schema';
import { EventMapper } from '../mapper/EventMapper';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import type { ApiError } from './EventCreationPage';
import { MissionItem } from '../../mission/components/MissionItem';
import { HeaderDetails } from '../../../shared/components/UI/HeaderDetails';
import { DeleteModal } from '../../../shared/components/UI/DeleteModal';
import Button from '../../../shared/components/UI/Button';
import { MissionCreationForm } from '../../mission/components/MissionCreationForm';
import type { MissionCreationFormValues } from '../../mission/validation/MissionCreation.schema';
import { useCreateMission } from '../../mission/hooks/use_mission.service';
import { AddIcon } from '../../../shared/components/UI/icons/icons';

interface EventDetailsProps {
    event: EventDetailsApiResponse;
}

export function EventDetailsCard({ event }: Readonly<EventDetailsProps>) {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    // Check is the current User is the organizer
    const canEdit = user?.id && event.organizer_id ? user.id === event.organizer_id : false;

    // Event update
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const updateMutation = useUpdateEvent();

    const handleSubmit = async (data: EventUpdateFormValues) => {
        setIsEditModalOpen(false);

        const promise = updateMutation.mutateAsync({
            id: event.id,
            data: EventMapper.toUpdateEvent(data),
        });

        toast.promise(promise, {
            loading: 'Chargement...',
            success: 'Événement mis à jour avec succés.',
            error: (err: AxiosError<ApiError>) => {
                return err.response?.data.message || 'Erreur lors de la mise à jour.';
            },
        });

        try {
            await promise;
            navigate(`/events/${event.id}`);
        } catch {
            // L'erreur est déjà gérée par toast.promise
        }
    };

    // Mission creation
    const [isCreateMissionModalOpen, setIsCreateMissionModalOpen] = useState<boolean>(false);
    const createMissionMutation = useCreateMission();
    const [missionErrorMessage, setMissionErrorMessage] = useState<string | null>(null);

    const handleMissionSubmit = async (data: MissionCreationFormValues) => {
        setIsCreateMissionModalOpen(false);

        const promise = createMissionMutation.mutateAsync({
            eventId: event.id,
            mission: data,
        });

        toast.promise(promise, {
            loading: 'Chargement...',
            success: 'Mission créer avec succés',
            error: (err: AxiosError<ApiError>) => {
                return err.response?.data.message || 'Erreur lors de la création';
            },
        });

        try {
            await promise;
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            const message = error.response?.data.message ?? 'Erreur lors de la création.';
            setMissionErrorMessage(message);
        }
    };

    // Event delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const deleteMutation = useDeleteEvent();

    const handleDelete = async () => {
        setIsDeleteModalOpen(false);

        const promise = deleteMutation.mutateAsync({ id: event.id });

        toast.promise(promise, {
            loading: 'Chargement...',
            success: 'Événement supprimé avec succés.',
            error: 'Erreur lors de la suppression',
        });

        try {
            await promise;
            navigate('/');
        } catch {
            // L'erreur est déjà gérée par toast.promise
        }
    };

    if (!event) return null;

    return (
        <>
            <div className="card bg-base-100 border border-base-300 shadow-sm p-4">
                {/* HEADER */}
                <HeaderDetails
                    key={event.id}
                    entity={event}
                    status={eventStatusLabel[event.status]}
                    statusColor={eventStatusColor}
                    canEdit={canEdit}
                    onEdit={() => setIsEditModalOpen(true)}
                    onDelete={() => setIsDeleteModalOpen(true)}
                />

                {/* DESCRIPTION */}
                <p className="text-gray-500">{event.description}</p>

                <div className="divider" />

                <section>
                    <h2 className="text-xl font-semibold mb-2 text-primary">Dates</h2>
                    <p>
                        Du {formatDate(event.start_date)} au {formatDate(event.end_date)}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2 text-primary">Programme</h2>
                    <p>{event.program}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2 text-primary">Adresse</h2>
                    <p>
                        {event.address.street_number} {event.address.street_name}
                    </p>
                    <p>
                        {event.address.postal_code} {event.address.city}
                    </p>
                    <p>{event.address.country}</p>
                </section>

                <section>
                    <div className="flex">
                        <h2 className="text-xl font-semibold mb-2 text-primary">Missions</h2>{' '}
                        {canEdit && (
                            <Button
                                onClick={() => setIsCreateMissionModalOpen(true)}
                                variant="ghost"
                                size="xs"
                            >
                                <AddIcon size={20} />
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {event.missions.map((mission) => (
                            <MissionItem key={mission.id} mission={mission} />
                        ))}
                    </div>
                </section>
            </div>

            {/* EDIT MODAL */}
            <Modal2 isOpen={isEditModalOpen} size="lg" onClose={() => setIsEditModalOpen(false)}>
                <FormLayout title="Modification d'évènement">
                    <EventUpdateForm
                        event={event}
                        onSubmit={handleSubmit}
                        isSubmitting={updateMutation.isPending}
                        error={updateMutation.isError}
                    />
                </FormLayout>
            </Modal2>

            {/* CREATE MISSION MODAL */}
            <Modal2
                isOpen={isCreateMissionModalOpen}
                size="lg"
                onClose={() => setIsCreateMissionModalOpen(false)}
            >
                <FormLayout title="Création de mission">
                    <MissionCreationForm
                        onSubmit={handleMissionSubmit}
                        isSubmitting={createMissionMutation.isPending}
                        error={missionErrorMessage}
                    />
                </FormLayout>
            </Modal2>

            {/* DELETE MODAL */}
            <DeleteModal
                key={event.id}
                message="Voulez vous vraiment supprimer cet évènement ?"
                size="sm"
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDelete}
            />
        </>
    );
}
