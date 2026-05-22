import { SignInForm } from '../../features/auth/components/SignInForm';
import { FormLayout } from '../../shared/layout/FormLayout';

export default function SigninPage() {
    return (
        <FormLayout title="Connexion">
            <SignInForm />
        </FormLayout>
    );
}
