import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { SignInForm } from '../../features/auth/components/SignInForm';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGoogleSignin } from '../../features/auth/hooks/use_auth.service';
import { PageContainer } from '../../shared/layout/PageContainer';
import { Card } from '../../shared/layout/Card';

export default function SigninPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const signin = useGoogleSignin();

    const onGoogleLogin = async (credentialsResponse: CredentialResponse) => {
        try {
            const idToken = credentialsResponse.credential;

            if (!idToken) throw new Error('Missing google token');

            await signin.mutateAsync({ idToken });
            await queryClient.invalidateQueries({
                queryKey: ['me'],
            });

            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <PageContainer>
            <Card title="Se connecter" size="lg">
                <SignInForm />

                <div className="flex justify-center items-center p-3">
                    <GoogleLogin
                        onSuccess={(credentialsResponse) => onGoogleLogin(credentialsResponse)}
                        onError={() => console.log('Login failed')}
                    ></GoogleLogin>
                </div>
            </Card>
        </PageContainer>
    );
}
