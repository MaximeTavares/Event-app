import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';
import { Link, useNavigate } from 'react-router';
import { LoginRequestDto, LoginRequestSchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSignin } from '@/features/auth/hooks/use_auth.service';
import { GoogleIcon } from '@/shared/components/UI/icons/icons';

export function SigninForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { googleLogin, isLoading } = useGoogleAuth();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid, isSubmitting },
    } = useForm<LoginRequestDto>({
        resolver: zodResolver(LoginRequestSchema),
        mode: 'onChange',
    });

    const signin = useSignin();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginRequestDto) => {
        try {
            await signin.mutateAsync(data);
            await navigate('/');
        } catch {
            setError('password', {
                message: 'Email ou mot de passe incorrect',
            });
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Bienvenu</CardTitle>
                    <CardDescription>Connectez vous avec votre compte google</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => googleLogin()}
                                    disabled={isLoading}
                                >
                                    <GoogleIcon />
                                    Se connecter avec Google
                                </Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Ou continuez avec
                            </FieldSeparator>

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

                            <Field>
                                <Button type="submit" disabled={!isValid || isSubmitting}>
                                    {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                                </Button>
                                <FieldDescription className="text-center">
                                    Vous n'avez pas de compte ?{' '}
                                    <Link to={'/auth/signup'}>S'inscrire</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
