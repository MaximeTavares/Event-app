import type React from "react";
import { FormLayout } from "../../layout/FormLayout";
import { Modal2 } from "./Modal2";

type FormModalProps = {
	formTitle: string;
	isOpen: boolean;
	onClose: () => void;
	size?: "sm" | "md" | "lg" | "xl" | "full";
	children: React.ReactNode;
};

export function FormModal({
	formTitle,
	isOpen,
	onClose,
	size,
	children,
}: Readonly<FormModalProps>) {
	return (
		<Modal2 isOpen={isOpen} onClose={onClose} size={size}>
			<FormLayout title={formTitle}>{children}</FormLayout>
		</Modal2>
	);
}
