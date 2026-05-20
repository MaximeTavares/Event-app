import { useState } from "react";
import Button from "./Button";
import { CheckIcon, EditPencil } from "./icons/icons";
import { FormField } from "./formField/FormField";

type EditableFieldProps<T> = {
	value: T;
	onSave: (value: T) => Promise<void>;
	options?: T[];
	toDisplay?: (value: T) => string;
	canEdit: boolean;
};

export function EditableField<T>({
	value,
	onSave,
	options,
	toDisplay,
	canEdit,
}: Readonly<EditableFieldProps<T>>) {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [localValue, setLocalValue] = useState<T>(value);

	const displayValue = toDisplay ? toDisplay(value) : String(value);

	const handleSave = async () => {
		await onSave(localValue);
		setIsEditing(false);
	};

	if (isEditing && options) {
		return (
			<div className="flex gap-2">
				<FormField
					as="select"
					value={String(localValue)}
					onChange={(e) => setLocalValue(e.target.value as T)}
				>
					{options.map((item) => (
						<option key={String(item)} value={String(item)}>
							{toDisplay ? toDisplay(item) : String(item)}
						</option>
					))}
				</FormField>
				<Button variant="ghost" size="sm" onClick={handleSave}>
					<CheckIcon />
				</Button>
			</div>
		);
	}

	if (isEditing) {
		return (
			<div className="flex gap-2">
				<input
					className="input input-bordered input-sm"
					value={String(localValue)}
					onChange={(e) => setLocalValue(e.target.value as T)}
				/>
				<Button variant="ghost" size="sm" onClick={handleSave}>
					<CheckIcon />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2 group">
			<span>{displayValue}</span>
			{canEdit && (
				<Button
					onClick={() => setIsEditing(true)}
					size="xs"
					variant="ghost"
					className="opacity-0 group-hover:opacity-100"
				>
					<EditPencil />
				</Button>
			)}
		</div>
	);
}
