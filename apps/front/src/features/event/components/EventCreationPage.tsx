import { useNavigate } from "react-router";
import { useCreateEvent } from "../hooks/use_event.service";
import { EventCreationForm } from "./EventCreationForm";
import { FormLayout } from "../../../shared/layout/FormLayout";
import type { EventCreationFormValues } from "../validation/eventCreation.schema";
import { EventMapper } from "../mapper/EventMapper";
import toast from "react-hot-toast";
import { useState } from "react";
import type { AxiosError } from "axios";

export type ApiError = {
	message: string;
};

export function EventCreationPage() {
	//Navigate
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	//Ecriture Tanstack Mutation
	const createMutation = useCreateEvent();

	const handleSubmit = async (data: EventCreationFormValues) => {
		const promise = createMutation.mutateAsync(EventMapper.toCreateEvent(data));

		toast.promise(promise, {
			loading: "Chargement...",
			success: "Événement créé avec succès",
			error: (err: AxiosError<ApiError>) => {
				return err.response?.data.message || "Erreur lors de la création.";
			},
		});

		try {
			await promise;
			console.log("🚀 ~ handleSubmit ~ promise:", promise);

			navigate("/me/events");
		} catch (err) {
			const error = err as AxiosError<ApiError>;
			const message = error.response?.data.message ?? "Erreur lors de la création.";
			setErrorMessage(message);
		}
	};

	return (
		<FormLayout title="Création d'évènement">
			<EventCreationForm
				onSubmit={handleSubmit}
				isSubmitting={createMutation.isPending}
				error={errorMessage}
			/>
		</FormLayout>
	);
}
