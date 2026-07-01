import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ChangePasswordDto, ChangePasswordSchema, passwordRules } from '@app/contracts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ChangePasswordFormProps = {
    onSubmit: (data: ChangePasswordDto) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
};

export function ChangePasswordForm({
    onSubmit,
    isSubmitting,
    error,
    className,
    ...props
}: Readonly<ChangePasswordFormProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>>) {
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
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Changement de mot de passe</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="change-password-form" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field data-invalid={!!errors.currentPassword}>
                                <FieldLabel htmlFor="currentPassword">
                                    Mot de passe actuel
                                </FieldLabel>
                                <Input
                                    {...register('currentPassword')}
                                    id="currentPassword"
                                    type="password"
                                    aria-invalid={!!errors.currentPassword}
                                />
                                {errors.currentPassword && (
                                    <FieldError errors={[errors.currentPassword]} />
                                )}
                            </Field>

                            <Field data-invalid={!!errors.newPassword}>
                                <FieldLabel htmlFor="newPassword">Nouveau mot de passe</FieldLabel>
                                <Input
                                    {...register('newPassword')}
                                    id="newPassword"
                                    type="password"
                                    aria-invalid={!!errors.newPassword}
                                />
                                {errors.newPassword && <FieldError errors={[errors.newPassword]} />}
                                <FieldDescription>
                                    Votre mot de passe doit contenir :
                                    <ul className="ml-5 text-xs text-muted-foreground">
                                        <li className={rules.length ? 'text-primary' : ''}>
                                            {rules.length ? '✓' : '•'} au moins 8 caractères
                                        </li>
                                        <li className={rules.numbers ? 'text-primary' : ''}>
                                            {rules.numbers ? '✓' : '•'} au moins 2 chiffres
                                        </li>
                                        <li className={rules.specials ? 'text-primary' : ''}>
                                            {rules.specials ? '✓' : '•'} au moins 2 caractères
                                            spéciaux
                                        </li>
                                    </ul>
                                </FieldDescription>
                            </Field>

                            <Field data-invalid={!!errors.confirmPassword}>
                                <FieldLabel htmlFor="confirmPassword">
                                    Confirmer le nouveau mot de passe
                                </FieldLabel>
                                <Input
                                    {...register('confirmPassword')}
                                    id="confirmPassword"
                                    type="password"
                                    aria-invalid={!!errors.confirmPassword}
                                />
                                {errors.confirmPassword && (
                                    <FieldError errors={[errors.confirmPassword]} />
                                )}
                            </Field>

                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        type="submit"
                        form="change-password-form"
                        disabled={!isDirty || !isValid || isSubmitting}
                    >
                        {isSubmitting ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
