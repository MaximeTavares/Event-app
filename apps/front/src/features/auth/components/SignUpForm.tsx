import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import { useSignup } from '../hooks/use_auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRules, SignupFormDto, SignupFormSchema } from '@app/contracts';
import { toastMutation } from '../../../shared/utils/useToastMutation';

export function SignUpForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFormDto>({
        resolver: zodResolver(SignupFormSchema),
        mode: 'onChange',
    });

    const password = watch('password', '');
    const navigate = useNavigate();
    const signup = useSignup();
    const rules = passwordRules(password);

    const onSubmit = async (data: SignupFormDto) => {
        if (data.password === data.confirmPassword) {
            await toastMutation(
                signup.mutateAsync({ email: data.email, password: data.password }),
                {
                    loading: 'Création du compte en cours...',
                    success: 'Compte créé avec succès, vous pouvez vous connecter.',
                    error: 'Erreur lors de la création du compte',
                },
            );
            await navigate('/auth/signin');
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

            <FormField
                type="password"
                label="Confirmation mot de passe"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />

            <button className="btn btn-neutral mt-2 w-full">S'inscrire</button>

            <Link to={'/auth/signin'}>
                <p className="flex justify-center">Déjà un compte ?</p>
            </Link>
        </form>
    );
}
