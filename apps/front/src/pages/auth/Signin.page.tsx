import { GoogleLogin } from '@react-oauth/google';
import { SignInForm } from '../../features/auth/components/SignInForm';
import { FormLayout } from '../../shared/layout/FormLayout';
import { useGoogleAuth } from '../../features/auth/hooks/useGoogleAuth';

export default function SigninPage() {
    const { googleLogin } = useGoogleAuth();

    return (
        <FormLayout title="Connexion" width="lg">
            <SignInForm />

            <div className="flex justify-center items-center">
                <GoogleLogin
                    onSuccess={(credentialsResponse) => googleLogin(credentialsResponse)}
                    onError={() => console.log('Login failed')}
                ></GoogleLogin>
            </div>
        </FormLayout>
    );
}
