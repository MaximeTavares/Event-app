import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { SignInForm } from '../../features/auth/components/SignInForm';
import { FormLayout } from '../../shared/layout/FormLayout';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGoogleSignin } from '../../features/auth/hooks/use_auth.service';

export default function SigninPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const signin = useGoogleSignin();

    const onGoogleLogin = async (credentialsResponse: CredentialResponse) => {
        try {
            const idToken = credentialsResponse.credential;

            if (!idToken) throw new Error('Missing google token');

            const data = await signin.mutateAsync({ idToken });
            await queryClient.invalidateQueries({
                queryKey: ['me'],
            });

            navigate('/');

            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <FormLayout title="Connexion" width="lg">
            <SignInForm />

            <div className="flex justify-center items-center">
                <GoogleLogin
                    onSuccess={(credentialsResponse) => onGoogleLogin(credentialsResponse)}
                    onError={() => console.log('Login failed')}
                ></GoogleLogin>
            </div>
        </FormLayout>
    );
}
