import { useSettings, useUpdateAvailability } from '../hooks/use_settings.service';
import { AvailabilityForm } from './AvailabilityForm';
import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { SkeletonLoading } from '../../../shared/components/UI/states/SkeletonLoading';
import { FormLayout } from '../../../shared/layout/FormLayout';

export default function AvailabilitySetting() {
    const { data, isPending, isError } = useSettings();

    const updateAvailability = useUpdateAvailability();

    if (isPending) {
        return <SkeletonLoading />;
    }

    if (isError || !data) {
        return <ErrorAlert message="Impossible de charger les disponibilités." />;
    }

    return (
        <FormLayout title="Mes disponibilité" width="xl">
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
        </FormLayout>
    );
}
