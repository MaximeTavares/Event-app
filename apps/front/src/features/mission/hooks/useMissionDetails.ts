import { useNavigate } from 'react-router';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { useCreateSlot } from '../../mission_slot/hooks/use_slot.service';
import { useDeleteMission, useUpdateMission } from './use_mission.service';
import { useMe } from '../../auth/hooks/use_auth.service';
import { MissionCreationFormValues, MissionDetailsDto, SlotFormValues } from '@app/contracts';

export function useMissionDetails(mission: MissionDetailsDto) {
    const { data: user } = useMe();

    const navigate = useNavigate();

    // Check if user can edit
    const canEdit = user?.id === mission.organizer_id;

    // Handle Mission delete
    const deleteMission = useDeleteMission();
    const handleDelete = async () => {
        await toastMutation(
            deleteMission.mutateAsync({ eventId: mission.event_id, missionId: mission.id }),
            {
                loading: 'Chargement...',
                success: 'Mission supprimée avec succés',
                error: 'Erreur lors de la suppréssion.',
            },
        );
        await navigate(`/events/${mission.event_id}`);
    };

    // Handle Mission update
    const updateMission = useUpdateMission();
    const handleUpdateMission = async (data: MissionCreationFormValues) => {
        await toastMutation(
            updateMission.mutateAsync({
                eventId: mission.event_id,
                missionId: mission.id,
                data: data,
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
    const handleSlotSubmit = async (data: SlotFormValues) => {
        await toastMutation(
            createSlot.mutateAsync({
                eventId: mission.event_id,
                missionId: mission.id,
                slot: data,
            }),
            {
                loading: 'Chargement...',
                success: 'Créneau créé avec succés',
                error: 'Erreur lors de la création',
            },
        );
    };

    return {
        // Onwership
        canEdit,
        // Handlers
        handleDelete,
        handleSlotSubmit,
        handleUpdateMission,
        // States
        createSlot,
    };
}
