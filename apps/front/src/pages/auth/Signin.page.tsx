import { GoogleLogin } from '@react-oauth/google';
import { SignInForm } from '../../features/auth/components/SignInForm';
import { useGoogleAuth } from '../../features/auth/hooks/useGoogleAuth';
import { Card } from '../../shared/layout/Card';

export default function SigninPage() {
    const { googleLogin } = useGoogleAuth();

    return (
        <Card title="Connexion" size="lg">
            <SignInForm />

            <div className="flex justify-center items-center p-3">
                <GoogleLogin
                    onSuccess={(credentialsResponse) => googleLogin(credentialsResponse)}
                    onError={() => console.log('Login failed')}
                ></GoogleLogin>
            </div>
        </Card>
    );
}
