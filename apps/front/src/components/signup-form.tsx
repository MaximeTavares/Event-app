import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router';
import { useSignup } from '@/features/auth/hooks/use_auth.service';
import { toastMutation } from '@/shared/utils/useToastMutation';
import { SignupFormDto, SignupFormSchema, passwordRules } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, isSubmitting },
    } = useForm<SignupFormDto>({
        resolver: zodResolver(SignupFormSchema),
        mode: 'onChange',
    });

    const password = watch('password', '');
    const navigate = useNavigate();
    const signup = useSignup();
    const rules = passwordRules(password);

    const onSubmit = async (data: SignupFormDto) => {
        await toastMutation(
            signup.mutateAsync({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            }),
            {
                loading: 'Création du compte en cours...',
                success: 'Compte créé avec succès, vous pouvez vous connecter.',
                error: 'Erreur lors de la création du compte',
            },
        );
        await navigate('/auth/signin');
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Créer un compte</CardTitle>
                    <CardDescription>
                        Renseignez vos informations pour créer un compte
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field className="grid grid-cols-2 gap-4">
                                <Field data-invalid={!!errors.firstName}>
                                    <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
                                    <Input
                                        {...register('firstName')}
                                        id="firstName"
                                        placeholder="John"
                                        aria-invalid={!!errors.firstName}
                                    />
                                    {errors.firstName && <FieldError errors={[errors.firstName]} />}
                                </Field>
                                <Field data-invalid={!!errors.lastName}>
                                    <FieldLabel htmlFor="lastName">Nom</FieldLabel>
                                    <Input
                                        {...register('lastName')}
                                        id="lastName"
                                        placeholder="Doe"
                                        aria-invalid={!!errors.lastName}
                                    />
                                    {errors.lastName && <FieldError errors={[errors.lastName]} />}
                                </Field>
                            </Field>

                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...register('email')}
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email && <FieldError errors={[errors.email]} />}
                            </Field>

                            <Field>
                                <Field data-invalid={!!errors.password}>
                                    <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                                    <Input
                                        {...register('password')}
                                        id="password"
                                        type="password"
                                        aria-invalid={!!errors.password}
                                    />
                                    {errors.password && <FieldError errors={[errors.password]} />}
                                </Field>

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

                                <Field data-invalid={!!errors.confirmPassword}>
                                    <FieldLabel htmlFor="confirmPassword">Confirmation</FieldLabel>
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
                            </Field>

                            <Field>
                                <Button type="submit" disabled={!isValid || isSubmitting}>
                                    {isSubmitting ? 'Création en cours...' : "S'inscrire"}
                                </Button>

                                <FieldDescription className="text-center">
                                    Déjà un compte ? <Link to="/auth/signin">Se connecter</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
