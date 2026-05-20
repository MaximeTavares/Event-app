import Button from "./Button";
import { TrashIcon } from "./icons/icons";
import { Modal2 } from "./Modal2";

type DeleteModalProps = {
	message: string;
	isOpen: boolean;
	onClose: () => void;
	onDelete: () => void;
	size?: "sm" | "md" | "lg" | "xl" | "full";
};

export function DeleteModal({
	message,
	isOpen,
	onClose,
	onDelete,
	size,
}: Readonly<DeleteModalProps>) {
	return (
		<Modal2 title="Confirmer la suppression" isOpen={isOpen} onClose={onClose} size={size}>
			<div>
				<div className="p-2">
					<p className=" text-gray-600 ">{message}</p>
				</div>

				<div className="flex justify-end gap-2 ">
					<Button data-cy="delete-event" variant="error" onClick={onDelete}>
						<TrashIcon/>
					</Button>
					<Button onClick={onClose}>Annuler</Button>
				</div>
			</div>
		</Modal2>
	);
}
