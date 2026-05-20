import { useNavigate } from "react-router";
import { toastMutation } from "../../../shared/utils/useToastMutation";
import { useAuthStore } from "../../auth/store/auth.store";
import type { SlotDetailsApiResponse } from "../types/slot.type";
import type { SlotCreationOutputValues } from "../validation/SlotCreation.schema";
import { useUpdateSlot, useDeleteSlot } from "./use_slot.service";

export function useSlotDetails(slot: SlotDetailsApiResponse) {
	const user = useAuthStore((state) => state.user);
	const navigate = useNavigate();

	const pendingParticipants = slot.participants.filter(
		(p) => p.participation_status === "PENDING",
	);

	const acceptedParticipants = slot.participants.filter(
		(p) => p.participation_status === "ACCEPTED",
	);

	// Check if user can edit
	const canEdit = user?.id === slot.organizer_id;

	// Handle slot update
	const useUpdate = useUpdateSlot();
	const handleUpdate = async (data: SlotCreationOutputValues) => {
		await toastMutation(useUpdate.mutateAsync({ slotId: slot.id, slot: data }), {
			loading: "Chargement...",
			success: "Créneau modifié avec succés",
			error: "Erreur lors de la modification",
		});
	};

	// Handle slot delete
	const useDelete = useDeleteSlot();
	const handleDelete = async () => {
		await toastMutation(useDelete.mutateAsync({ id: slot.id }), {
			loading: "Chargement...",
			success: "Créneau supprimé avec succés",
			error: "Erreur lors de la suppression",
		});

		navigate(-1);
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
		useUpdate,
	};
}
