import { SignUpForm } from '../../features/auth/components/SignUpForm';
import { FormLayout } from '../../shared/layout/FormLayout';

export default function SignupPage() {
    return (
        <FormLayout title={'Inscription'}>
            <SignUpForm />
        </FormLayout>
    );
}
