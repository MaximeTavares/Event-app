import { GoogleLogin } from '@react-oauth/google';
import { SignUpForm } from '../../features/auth/components/SignUpForm';
import { Card } from '../../shared/layout/Card';
import { PageContainer } from '../../shared/layout/PageContainer';
import { useGoogleAuth } from '../../features/auth/hooks/useGoogleAuth';

export default function SignupPage() {
    const { googleLogin } = useGoogleAuth();

    return (
        <PageContainer>
            <Card title="S'inscrire" size="lg">
                <SignUpForm />
                <div className="flex justify-center items-center p-3">
                    <GoogleLogin
                        onSuccess={(credentialsResponse) => googleLogin(credentialsResponse)}
                        onError={() => console.log('Login failed')}
                    ></GoogleLogin>
                </div>
            </Card>
        </PageContainer>
    );
}
