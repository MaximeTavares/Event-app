import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
	sm: "sm:max-w-md lg:max-w-lg",
	md: "sm:max-w-lg lg:max-w-2xl",
	lg: "sm:max-w-2xl lg:max-w-4xl",
	xl: "sm:max-w-4xl lg:max-w-6xl",
	full: "sm:max-w-screen-lg lg:max-w-screen-xl",
};

export function Modal2({ isOpen, onClose, title, children, size }: Readonly<ModalProps>) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	// Synchronise React state et dialog API
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen && !dialog.open) {
			dialog.showModal();
		}

		if (!isOpen && dialog.open) {
			dialog.close();
			onClose();
		}
	}, [isOpen, onClose]);

	return (
		<dialog
			ref={dialogRef}
			className="modal modal-bottom sm:modal-middle"
			onClose={onClose}
			onCancel={onClose}
		>
			<div
				className={`
					modal-box
					w-full
					max-w-full ${sizeClasses[size ?? "lg"]} `}
			>
				<h3 className="font-bold text-lg">{title}</h3>

				{children}

				{/* <div className="modal-action">
					<form method="dialog">
						<button className="btn">Close</button>
					</form>
				</div> */}
			</div>

			{/* Backdrop */}
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
}
