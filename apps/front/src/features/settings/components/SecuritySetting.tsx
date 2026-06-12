import { useChangePassword, useSettings, useUpdateSecurity } from '../hooks/use_settings.service';

import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { ChangePasswordForm } from './ChangePasswordForm';
import { SecurityForm } from './SecurityForm';
import { toastMutation } from '../../../shared/utils/useToastMutation';

export default function SecuritySettings() {
    const { data, isPending, isError } = useSettings();
    const updateSecurity = useUpdateSecurity();
    const changePassword = useChangePassword();

    if (isPending) {
        return <p>Chargement...</p>;
    }

    if (isError || !data) {
        return <ErrorAlert message="Impossible de charger vos informations." />;
    }

    return (
        <div className="p-4">
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
        </div>
    );
}
