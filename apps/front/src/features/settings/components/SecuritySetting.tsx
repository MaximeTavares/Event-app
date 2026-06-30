import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { ChangePasswordForm } from './ChangePasswordForm';
import { SecurityForm } from './SecurityForm';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { SkeletonLoading } from '../../../shared/components/UI/states/SkeletonLoading';
import { useSecurity, useUpdateSecurity } from '../hooks/use-security';
import { useChangePassword } from '../hooks/use-settings-section';

export default function SecuritySettings() {
    const { data: security, isPending, isError } = useSecurity();
    const updateSecurity = useUpdateSecurity();
    const changePassword = useChangePassword();

    if (isPending) {
        return <SkeletonLoading />;
    }

    if (isError || !security) {
        return <ErrorAlert message="Impossible de charger vos informations." />;
    }

    return (
        <>
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
                className="mt-5"
                defaultValues={security}
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
        </>
    );
}
