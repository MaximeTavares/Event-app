import { PreferenceForm } from './PreferenceForm';
import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { SkeletonLoading } from '../../../shared/components/UI/states/SkeletonLoading';
import { usePreferences, useUpdatePreferences } from '../hooks/use-preferences';

export default function PreferencesSetting() {
    const { data: preferences, isPending, isError } = usePreferences();
    const updatePreferences = useUpdatePreferences();

    if (isPending) {
        return <SkeletonLoading />;
    }

    if (isError || !preferences) {
        return <ErrorAlert message="Impossible de charger les préférences." />;
    }

    return (
        <PreferenceForm
            defaultValues={preferences}
            onSubmit={async (data) => {
                await toastMutation(updatePreferences.mutateAsync(data), {
                    loading: 'Chargement...',
                    success: 'Préférences modifiées',
                    error: "Impossible d'enregistrer",
                });
            }}
            isSubmitting={updatePreferences.isPending}
            error={
                updatePreferences.isError ? "Impossible d'enregistrer les préferences" : undefined
            }
        />
    );
}
