import type { CredentialResponse } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useGoogleSignin } from './use_auth.service';

export function useGoogleAuth() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const signin = useGoogleSignin();

    const googleLogin = async (credentialsResponse: CredentialResponse) => {
        const idToken = credentialsResponse.credential;

        if (!idToken) throw new Error('Missing google token');

        await signin.mutateAsync({ idToken });
        await queryClient.invalidateQueries({
            queryKey: ['me'],
        });

        navigate('/');
    };

    return {
        googleLogin,
        isLoading: signin.isPending,
    };
}
