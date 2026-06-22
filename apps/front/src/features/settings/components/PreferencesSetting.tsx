import { useSettings, useUpdatePreferences } from '../hooks/use_settings.service';
import { PreferenceForm } from './PreferenceForm';
import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { SkeletonLoading } from '../../../shared/components/UI/states/SkeletonLoading';
import { FormLayout } from '../../../shared/layout/FormLayout';

export default function PreferencesSetting() {
    const { data, isPending, isError } = useSettings();
    const updatePreferences = useUpdatePreferences();

    if (isPending) {
        return <SkeletonLoading />;
    }

    if (isError || !data) {
        return <ErrorAlert message="Impossible de charger les préférences." />;
    }

    return (
        <FormLayout title="Préférences" width="xl">
            <PreferenceForm
                defaultValues={data?.preferences}
                onSubmit={async (data) => {
                    await toastMutation(updatePreferences.mutateAsync(data), {
                        loading: 'Chargement...',
                        success: 'Préférences modifiées',
                        error: "Impossible d'enregistrer",
                    });
                }}
                isSubmitting={updatePreferences.isPending}
                error={
                    updatePreferences.isError
                        ? "Impossible d'enregistrer les préferences"
                        : undefined
                }
            />
        </FormLayout>
    );
}
