import { formatInTimeZone } from "date-fns-tz";
import { slotStatusColor, slotStatusLabel, type SlotDetailsApiResponse } from "../types/slot.type";
import { ParticipantItem } from "../../participation/components/ParticipantItem";
import { HeaderDetails } from "../../../shared/components/UI/HeaderDetails";
import { DeleteModal } from "../../../shared/components/UI/DeleteModal";
import { useState } from "react";
import { SlotCreationForm } from "./SlotCreationForm";
import { useSlotDetails } from "../hooks/useSlotDetails";
import { FormModal } from "../../../shared/components/UI/FormModal";
import type { SlotCreationOutputValues } from "../validation/SlotCreation.schema";
import { SlotMapper } from "../mapper/SlotMapper";

type SlotDetailsProps = {
	slot: SlotDetailsApiResponse;
};

export function SlotDetails({ slot }: Readonly<SlotDetailsProps>) {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

	const {
		acceptedParticipants,
		pendingParticipants,
		canEdit,
		handleDelete,
		handleUpdate,
		useUpdate,
	} = useSlotDetails(slot);

	const onUpdate = async (data: SlotCreationOutputValues) => {
		setIsEditModalOpen(false);
		await handleUpdate(data);
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
				<p>{formatInTimeZone(slot.start_at, "Europe/Paris", "dd/MM/yyyy à HH:mm")}</p>

				<h2 className="text-xl font-semibold mb-2 text-primary">Fin</h2>
				<p>{formatInTimeZone(slot.end_at, "Europe/Paris", "dd/MM/yyyy à HH:mm")}</p>

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
			</div>

			{/* EDIT MODAL */}
			<FormModal
				formTitle="Modification de créneau"
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
			>
				<SlotCreationForm
					onSubmit={onUpdate}
					isSubmitting={useUpdate.isPending}
					error={useUpdate.isError}
					defaultValues={SlotMapper.toDefaultValues(slot)}
				/>
			</FormModal>

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
