import { useNavigate } from 'react-router';
import type { MissionDetailsApiResponse, UpdateMissionInput } from '../types/mission.type';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { useCreateSlot } from '../../mission_slot/hooks/use_slot.service';
import type { SlotCreationOutputValues } from '../../mission_slot/validation/SlotCreation.schema';
import { useDeleteMission, useUpdateMission } from './use_mission.service';
import { useMe } from '../../auth/hooks/use_auth.service';

export function useMissionDetails(mission: MissionDetailsApiResponse) {
    const { data: user } = useMe();

    const navigate = useNavigate();

    // Check if user can edit
    const canEdit = user?.id === mission.organizer_id;

    // Handle Mission delete
    const deleteMission = useDeleteMission();
    const handleDelete = async () => {
        await toastMutation(deleteMission.mutateAsync({ id: mission.id }), {
            loading: 'Chargement...',
            success: 'Mission supprimée avec succés',
            error: 'Erreur lors de la suppréssion.',
        });
        navigate(`/events/${mission.event_id}`);
    };

    // Handle Mission update
    const updateMission = useUpdateMission();
    const updateField = async <K extends keyof UpdateMissionInput>(
        fieldName: K,
        newValue: UpdateMissionInput[K],
    ) => {
        await toastMutation(
            updateMission.mutateAsync({
                id: mission.id,
                data: { [fieldName]: newValue },
            }),
            {
                loading: 'Chargement...',
                success: 'Modification réalisée avec succés',
                error: 'Erreur lors de la mise à jour.',
            },
        );
    };

    // Handle Slot Creation
    const createSlot = useCreateSlot();
    const handleSlotSubmit = async (data: SlotCreationOutputValues) => {
        await toastMutation(createSlot.mutateAsync({ missionId: mission.id, slot: data }), {
            loading: 'Chargement...',
            success: 'Créneau créé avec succés',
            error: 'Erreur lors de la création',
        });
    };

    return {
        // Onwership
        canEdit,
        // Handlers
        handleDelete,
        handleSlotSubmit,
        updateField,
        // States
        createSlot,
    };
}
