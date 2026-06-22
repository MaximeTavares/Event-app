import { useChangePassword, useSettings, useUpdateSecurity } from '../hooks/use_settings.service';

import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { ChangePasswordForm } from './ChangePasswordForm';
import { SecurityForm } from './SecurityForm';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { SkeletonLoading } from '../../../shared/components/UI/states/SkeletonLoading';
import { FormLayout } from '../../../shared/layout/FormLayout';

export default function SecuritySettings() {
    const { data, isPending, isError } = useSettings();
    const updateSecurity = useUpdateSecurity();
    const changePassword = useChangePassword();

    if (isPending) {
        return <SkeletonLoading />;
    }

    if (isError || !data) {
        return <ErrorAlert message="Impossible de charger vos informations." />;
    }

    return (
        <FormLayout title="Securité" width="xl">
            <ChangePasswordForm
                onSubmit={async (data) => {
                    await toastMutation(changePassword.mutateAsync(data), {
                        loading: 'Chargement...',
                        success: 'Mot de passe modifié avec succès',
                        error: "Impossible d'enregistrer",
                    });
                }}
                isSubmitting={changePassword.isPending}
                error={
                    changePassword.isError ? "Impossible d'enregistrer les changements" : undefined
                }
            />

            <SecurityForm
                defaultValues={data.security}
                onSubmit={async (data) => {
                    await toastMutation(updateSecurity.mutateAsync(data), {
                        loading: 'Chargement...',
                        success: 'Préférences de sécurité modifiées',
                        error: "Impossible d'enregistrer",
                    });
                }}
                isSubmitting={updateSecurity.isPending}
                error={
                    updateSecurity.isError ? "Impossible d'enregistrer les changements" : undefined
                }
            />
        </FormLayout>
    );
}
