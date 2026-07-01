import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDeleteEvent, useUpdateEvent } from '../hooks/use_event.service';
import { useCreateMission } from '../../mission/hooks/use_mission.service';
import { useMe } from '../../auth/hooks/use_auth.service';
import { EventMapper } from '../mapper/EventMapper';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { EventDto, EventCreationFormValues, MissionCreationFormValues } from '@app/contracts';

export function useEventDetails(event: EventDto) {
    const { data: user } = useMe();
    const navigate = useNavigate();

    // Ownership
    const canEdit = user?.id && event.organizer_id ? user.id === event.organizer_id : false;

    // --- Edit event ---
    const [isEditOpen, setIsEditOpen] = useState(false);
    const updateMutation = useUpdateEvent();

    const handleUpdate = async (data: EventCreationFormValues) => {
        setIsEditOpen(false);
        await toastMutation(
            updateMutation.mutateAsync({
                id: event.id,
                data: EventMapper.toCreateEvent(data),
            }),
            {
                loading: 'Chargement...',
                success: 'Événement mis à jour avec succès.',
                error: 'Erreur lors de la mise à jour.',
            },
        );
        await navigate(`/events/${event.id}`);
    };

    // --- Create mission ---
    const [isCreateMissionOpen, setIsCreateMissionOpen] = useState(false);
    const createMissionMutation = useCreateMission();

    const handleCreateMission = async (data: MissionCreationFormValues) => {
        setIsCreateMissionOpen(false);

        await toastMutation(
            createMissionMutation.mutateAsync({
                eventId: event.id,
                mission: data,
            }),
            {
                loading: 'Chargement...',
                success: 'Mission créée avec succès.',
                error: 'Erreur lors de la création.',
            },
        );
    };

    // --- Delete event ---
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const deleteMutation = useDeleteEvent();

    const handleDelete = async () => {
        setIsDeleteOpen(false);
        await toastMutation(deleteMutation.mutateAsync({ id: event.id }), {
            loading: 'Chargement...',
            success: 'Événement supprimé avec succès.',
            error: 'Erreur lors de la suppression.',
        });
        await navigate('/');
    };

    return {
        // Ownership
        canEdit,
        // Edit state
        isEditOpen,
        setIsEditOpen,
        updateMutation,
        handleUpdate,
        // Mission state
        isCreateMissionOpen,
        setIsCreateMissionOpen,
        createMissionMutation,
        handleCreateMission,
        // Delete state
        isDeleteOpen,
        setIsDeleteOpen,
        handleDelete,
    };
}
