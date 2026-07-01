import { useGoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useGoogleSignin } from './use_auth.service';

export function useGoogleAuth() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const signin = useGoogleSignin();

    const handleSuccess = async (codeResponse: { code: string }) => {
        await signin.mutateAsync({ code: codeResponse.code });
        await queryClient.invalidateQueries({
            queryKey: ['me'],
        });

        await navigate('/');
    };

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleSuccess,
        onError: () => console.error('Échec de connexion Google'),
    });

    return {
        googleLogin, // appelle directement googleLogin() au clic
        isLoading: signin.isPending,
    };
}
