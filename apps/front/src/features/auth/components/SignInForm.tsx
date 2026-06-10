import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequestDto, LoginRequestSchema } from '@app/contracts';
import { useSigninHandler } from '../hooks/useSigninHandler';

export function SignInForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginRequestDto>({
        resolver: zodResolver(LoginRequestSchema),
        mode: 'onChange',
    });

    const signinHandler = useSigninHandler();
    const onSubmit = async (data: LoginRequestDto) => {
        try {
            await signinHandler(data);
        } catch {
            setError('password', {
                message: 'Email ou mot de passe incorrect',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
                type="input"
                label="Email"
                error={errors.email?.message}
                {...register('email')}
            />

            <FormField
                type="password"
                label="Mot de passe"
                error={errors.password?.message}
                {...register('password')}
            />

            <button data-cy="signin-submit" className="btn btn-neutral mt-2 w-full">
                Se connecter
            </button>

            <Link to={'/auth/signup'}>
                <p className="flex justify-center">Vous n'avez pas de compte ?</p>
            </Link>
        </form>
    );
}
