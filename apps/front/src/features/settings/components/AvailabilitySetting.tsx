import { useSettings, useUpdateAvailability } from '../hooks/use_settings.service';
import { AvailabilityForm } from './AvailabilityForm';
import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { toastMutation } from '../../../shared/utils/useToastMutation';

export default function AvailabilitySetting() {
    const { data, isPending, isError } = useSettings();

    const updateAvailability = useUpdateAvailability();

    if (isPending) {
        return <p>Chargement...</p>;
    }

    if (isError || !data) {
        return <ErrorAlert message="Impossible de charger les disponibilités." />;
    }

    return (
        <AvailabilityForm
            defaultValues={data.availability}
            onSubmit={async (data) => {
                await toastMutation(updateAvailability.mutateAsync(data), {
                    loading: 'Chargement...',
                    success: 'Disponibilités modifiées',
                    error: "Impossible d'enregistrer",
                });
            }}
            error={
                updateAvailability.isError
                    ? "Impossible d'enregistrer les disponibilités."
                    : undefined
            }
            isSubmitting={updateAvailability.isPending}
        />
    );
}
