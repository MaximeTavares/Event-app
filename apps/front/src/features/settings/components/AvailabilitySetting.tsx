import { AvailabilityForm } from './AvailabilityForm';
import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { SkeletonLoading } from '../../../shared/components/UI/states/SkeletonLoading';
import { useAvailability, useUpdateAvailability } from '../hooks/use-availability';

export default function AvailabilitySetting() {
    const { data: availability, isPending, isError } = useAvailability();

    const updateAvailability = useUpdateAvailability();

    if (isPending) {
        return <SkeletonLoading />;
    }

    if (isError || !availability) {
        return <ErrorAlert message="Impossible de charger les disponibilités." />;
    }

    return (
        <AvailabilityForm
            defaultValues={availability}
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
