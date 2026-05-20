import { useForm } from "react-hook-form";
import {
	MissionCreationSchema,
	type MissionCreationFormValues,
} from "../validation/MissionCreation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "../../../shared/components/UI/formField/FormField";

type MissionCreationFormProps = {
	onSubmit: (data: MissionCreationFormValues) => Promise<void>;
	isSubmitting?: boolean;
	error?: string | null;
};

export function MissionCreationForm({
	onSubmit,
	isSubmitting,
	error,
}: Readonly<MissionCreationFormProps>) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<MissionCreationFormValues>({
		resolver: zodResolver(MissionCreationSchema),
		mode: "onChange",
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<FormField label="Title" error={errors.title?.message} {...register("title")} />

			<FormField
				label="Description"
				error={errors.description?.message}
				{...register("description")}
			/>

			<FormField
				as="select"
				label={"Status"}
				defaultValue={"OPEN"}
				error={errors.status?.message}
				{...register("status")}
			>
				<option value={"OPEN"}>Ouvert</option>
			</FormField>

			{error && <p className="text-error text-sm">{error}</p>}

			<button className="btn btn-neutral mt-2 w-full" disabled={!isValid || isSubmitting}>
				{isSubmitting ? "Création..." : "Créer la mission"}
			</button>
		</form>
	);
}
