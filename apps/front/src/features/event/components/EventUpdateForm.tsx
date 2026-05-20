import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "../../../shared/components/UI/formField/FormField";
import {
	eventStatusLabel,
	eventStatusOptions,
	type EventDetailsApiResponse,
} from "../types/event.type";
import { toDateInputValue } from "../../../shared/utils/formatDate";
import { type EventUpdateFormValues, eventUpdateSchema } from "../validation/eventUpdate.schema";

type EventUpdateFormProps = {
	event: EventDetailsApiResponse;
	onSubmit: (data: EventUpdateFormValues) => Promise<void>;
	isSubmitting?: boolean;
	error?: boolean;
};

export function EventUpdateForm({
	event,
	onSubmit,
	isSubmitting,
	error,
}: Readonly<EventUpdateFormProps>) {
	const defaultValues: EventUpdateFormValues = {
		title: event?.title,
		description: event?.description,
		program: event?.program,
		start_date: toDateInputValue(event?.start_date),
		end_date: toDateInputValue(event?.end_date),
		status: event?.status,
		address: event?.address
			? {
					city: event?.address?.city,
					country: event?.address?.country,
					postal_code: event?.address?.postal_code,
					street_name: event?.address?.street_name,
					street_number: event?.address?.street_number,
					address_line_2: event?.address?.address_line_2 ?? "",
				}
			: undefined,
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<EventUpdateFormValues>({
		resolver: zodResolver(eventUpdateSchema),
		mode: "onChange",
		defaultValues,
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<FormField data-cy="event-title" label={"Title"} error={errors.title?.message} {...register("title")} />

			<FormField
				as="textarea"
				label="Description"
				error={errors.description?.message}
				{...register("description")}
			/>

			<FormField
				as="textarea"
				label="Programme"
				rows={6}
				error={errors.program?.message}
				{...register("program")}
			/>

			<div className="flex justify-center gap-3">
				<div className="flex-1">
					<FormField
						type="date"
						label="Date de début"
						error={errors.start_date?.message}
						{...register("start_date")}
					/>
				</div>
				<div className="flex-1">
					<FormField
						type="date"
						label="Date de fin"
						error={errors.end_date?.message}
						{...register("end_date")}
					/>
				</div>
			</div>

			<FormField
				as="select"
				label={"Status"}
				defaultValue={"Brouillon"}
				error={errors.status?.message}
				{...register("status")}
			>
				{eventStatusOptions.map((status) => (
					<option key={status} value={status}>
						{eventStatusLabel[status]}
					</option>
				))}
			</FormField>

			<div>
				<p className="label p-1 text-lg">Adresse</p>

				<div className="flex gap-3">
					<div className="w-20">
						<FormField
							label="Numéro"
							error={errors.address?.street_number?.message}
							{...register("address.street_number")}
						/>
					</div>
					<div className="flex-1">
						<FormField
							label="Nom de rue"
							error={errors.address?.street_name?.message}
							{...register("address.street_name")}
						/>
					</div>
				</div>

				<FormField
					label="Complément d'adresse"
					error={errors.address?.address_line_2?.message}
					{...register("address.address_line_2")}
				/>

				<div className="flex justify-between gap-3">
					<div className="flex-1">
						<FormField
							label="Code postal"
							error={errors.address?.postal_code?.message}
							{...register("address.postal_code")}
						/>
					</div>
					<div className="flex-1">
						<FormField
							label="Ville"
							error={errors.address?.city?.message}
							{...register("address.city")}
						/>
					</div>
				</div>
				<FormField
					label="Pays"
					error={errors.address?.country?.message}
					{...register("address.country")}
				/>
			</div>

			{error && (
				<p className="text-error text-sm">
					Une erreur est survenue lors de la modification de l'évènement.
				</p>
			)}

			<button data-cy="submit-event" className="btn btn-neutral mt-2 w-full" disabled={!isValid || isSubmitting}>
				{isSubmitting ? "Mise à jour..." : "Mettre à jour"}
			</button>
		</form>
	);
}
