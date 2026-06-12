import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { useSettings, useUpdateNotifications } from '../hooks/use_settings.service';
import { NotificationsForm } from './NotificationsForm';

export default function NotificationsSetting() {
    const { data, isPending, isError } = useSettings();
    const updateNotifications = useUpdateNotifications();

    if (isPending) {
        return <p>Chargement...</p>;
    }

    if (isError || !data) {
        return <ErrorAlert message="Impossible de charger vos informations." />;
    }

    return (
        <NotificationsForm
            defaultValues={data?.notifications}
            onSubmit={async (data) => {
                await toastMutation(updateNotifications.mutateAsync(data), {
                    loading: 'Chargement...',
                    success: 'Préférences de notifications modifiées',
                    error: "Impossible d'enregistrer",
                });
            }}
            isSubmitting={updateNotifications.isPending}
            error={
                updateNotifications.isError ? "Impossible d'enregistrer les changements" : undefined
            }
        />
    );
}
