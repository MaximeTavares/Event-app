import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { SignInForm } from '../../features/auth/components/SignInForm';
import { FormLayout } from '../../shared/layout/FormLayout';
import { AuthApi } from '../../features/auth/api/auth.api';

export default function SigninPage() {
    const onGoogleLogin = async (credentialsResponse: CredentialResponse) => {
        try {
            const idToken = credentialsResponse.credential;

            if (!idToken) throw new Error('Missing google token');

            const data = await AuthApi.googleSignin(idToken);

            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <FormLayout title="Connexion">
                <SignInForm />
            </FormLayout>

            <GoogleLogin
                onSuccess={(credentialsResponse) => onGoogleLogin(credentialsResponse)}
                onError={() => console.log('Login failed')}
            ></GoogleLogin>
        </>
    );
}
