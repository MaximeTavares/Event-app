import { useNavigate } from 'react-router';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { useUpdateSlot, useDeleteSlot } from './use_slot.service';
import { useMe } from '../../auth/hooks/use_auth.service';
import { SlotDetails, SlotFormValues } from '@app/contracts';

export function useSlotDetails(slot: SlotDetails) {
    const { data: user } = useMe();

    const navigate = useNavigate();

    const pendingParticipants = slot.participants.filter((p) => p.status === 'PENDING');

    const acceptedParticipants = slot.participants.filter((p) => p.status === 'ACCEPTED');

    // Check if user can edit
    const canEdit = user?.id === slot.organizer_id;

    // Handle slot update
    const updateSlotMutation = useUpdateSlot();
    const handleUpdate = async (data: SlotFormValues) => {
        await toastMutation(
            updateSlotMutation.mutateAsync({
                eventId: slot.eventId,
                missionId: slot.missionId,
                slotId: slot.id,
                slot: data,
            }),
            {
                loading: 'Chargement...',
                success: 'Créneau modifié avec succès',
                error: 'Erreur lors de la modification',
            },
        );
    };

    // Handle slot delete
    const deleteSlotMutation = useDeleteSlot();
    const handleDelete = async () => {
        await toastMutation(
            deleteSlotMutation.mutateAsync({
                eventId: slot.eventId,
                missionId: slot.missionId,
                slotId: slot.id,
            }),
            {
                loading: 'Chargement...',
                success: 'Créneau supprimé avec succès',
                error: 'Erreur lors de la suppression',
            },
        );

        await navigate(-1);
    };

    return {
        // Filered participants
        pendingParticipants,
        acceptedParticipants,
        // Ownership
        canEdit,
        // Handlers
        handleUpdate,
        handleDelete,
        // State
        updateSlotMutation,
    };
}
