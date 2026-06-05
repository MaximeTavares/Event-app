import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import Button from '../../../shared/components/UI/Button';
import { changePasswordSchema, securityPreferencesSchema } from '../validation/security.schema';
import { useChangePassword, usePatchSettings, useSettings } from '../hooks/use_settings.service';
import { mergeMeSettings, type MeSettings } from '../types/types';

type PasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type SecurityPrefsForm = Pick<MeSettings['security'], 'twoFactorEnabled'>;

export default function SecuritySettings() {
    const { data, isPending, isError, refetch } = useSettings();
    const patch = usePatchSettings();
    const changePassword = useChangePassword();
    const merged = mergeMeSettings(data);

    const passwordForm = useForm<PasswordForm>({
        resolver: yupResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const {
        register: registerSecurity,
        handleSubmit: submitSecurity,
        reset: resetSecurity,
    } = useForm<SecurityPrefsForm>({
        resolver: yupResolver(securityPreferencesSchema),
        defaultValues: merged.security,
    });

    useEffect(() => {
        resetSecurity(mergeMeSettings(data).security);
    }, [data, resetSecurity]);

    if (isPending) {
        return <p className="text-base-content/70">Chargement…</p>;
    }

    if (isError) {
        return (
            <div className="flex flex-col gap-3">
                <p className="text-error">Impossible de charger vos paramètres.</p>
                <button
                    type="button"
                    className="btn btn-outline btn-sm w-fit"
                    onClick={() => refetch()}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="flex max-w-xl flex-col gap-10">
            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Mot de passe</h2>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={passwordForm.handleSubmit(
                        async ({ currentPassword, newPassword }) => {
                            await changePassword.mutateAsync({ currentPassword, newPassword });
                            passwordForm.reset({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                            });
                        },
                    )}
                >
                    <FormField
                        type="password"
                        label="Mot de passe actuel"
                        error={passwordForm.formState.errors.currentPassword?.message}
                        {...passwordForm.register('currentPassword')}
                    />
                    <FormField
                        type="password"
                        label="Nouveau mot de passe"
                        error={passwordForm.formState.errors.newPassword?.message}
                        {...passwordForm.register('newPassword')}
                    />
                    <FormField
                        type="password"
                        label="Confirmer le nouveau mot de passe"
                        error={passwordForm.formState.errors.confirmPassword?.message}
                        {...passwordForm.register('confirmPassword')}
                    />
                    <Button type="submit" disabled={changePassword.isPending}>
                        {changePassword.isPending
                            ? 'Mise à jour…'
                            : 'Mettre à jour le mot de passe'}
                    </Button>
                </form>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Authentification à deux facteurs (2FA)</h2>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={submitSecurity((values) => patch.mutate({ security: values }))}
                >
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            {...registerSecurity('twoFactorEnabled')}
                        />
                        <span>Activer l’A2F sur mon compte</span>
                    </label>
                    <Button type="submit" disabled={patch.isPending}>
                        {patch.isPending ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                </form>
            </section>
        </div>
    );
}
