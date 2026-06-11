import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/UI/Button';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import { ChangePasswordDto, ChangePasswordSchema, passwordRules } from '@app/contracts';

type ChangePasswordFormProps = {
    onSubmit: (data: ChangePasswordDto) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
};

export function ChangePasswordForm({
    onSubmit,
    isSubmitting,
    error,
}: Readonly<ChangePasswordFormProps>) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm<ChangePasswordDto>({
        resolver: zodResolver(ChangePasswordSchema),
        mode: 'onChange',
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const newPassword = watch('newPassword', '');
    const rules = passwordRules(newPassword);

    return (
        <div className="flex max-w-xl flex-col gap-10">
            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Mot de passe</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                        type="password"
                        label="Mot de passe actuel"
                        error={errors.currentPassword?.message}
                        {...register('currentPassword')}
                    />
                    <FormField
                        type="password"
                        label="Nouveau mot de passe"
                        error={errors.newPassword?.message}
                        {...register('newPassword')}
                    />
                    <FormField
                        type="password"
                        label="Confirmer le nouveau mot de passe"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <div className="label">
                        <span className="label-text-alt text-base-content/70">
                            Votre mot de passe doit contenir :
                        </span>
                    </div>

                    <ul className="text-xs text-base-content/70 ml-5">
                        <li className={rules.length ? 'text-secondary' : 'text-base-content/70'}>
                            {rules.length ? '✓' : '•'} au moins 8 caractères
                        </li>
                        <li className={rules.numbers ? 'text-secondary' : 'text-base-content/70'}>
                            {rules.numbers ? '✓' : '•'} au moins 2 chiffres
                        </li>
                        <li className={rules.specials ? 'text-secondary' : 'text-base-content/70'}>
                            {rules.specials ? '✓' : '•'} au moins 2 caractères spéciaux
                        </li>
                    </ul>

                    {error && <p className="text-error text-sm">{error}</p>}

                    <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
                        {isSubmitting ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
                    </Button>
                </form>
            </section>
        </div>
    );
}
