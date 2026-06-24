import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { SkeletonLoading } from '../../../shared/components/UI/states/SkeletonLoading';
import { FormLayout } from '../../../shared/layout/FormLayout';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { useNotifications, useUpdateNotifications } from '../hooks/use-notifications';
import { NotificationsForm } from './NotificationsForm';

export default function NotificationsSetting() {
    const { data: notifications, isPending, isError } = useNotifications();
    const updateNotifications = useUpdateNotifications();

    if (isPending) {
        return <SkeletonLoading />;
    }

    if (isError || !notifications) {
        return <ErrorAlert message="Impossible de charger vos informations." />;
    }

    return (
        <FormLayout title="Notifications" width="xl">
            <NotificationsForm
                defaultValues={notifications}
                onSubmit={async (data) => {
                    await toastMutation(updateNotifications.mutateAsync(data), {
                        loading: 'Chargement...',
                        success: 'Préférences de notifications modifiées',
                        error: "Impossible d'enregistrer",
                    });
                }}
                isSubmitting={updateNotifications.isPending}
                error={
                    updateNotifications.isError
                        ? "Impossible d'enregistrer les changements"
                        : undefined
                }
            />
        </FormLayout>
    );
}
