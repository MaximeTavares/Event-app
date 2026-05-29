import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../api/auth.api';
import type { AuthResponse, MeResponse, SigninData, SignupData } from '../types/types';
import { useAuthStore } from '../store/auth.store';

export function useSignin() {
    const { setAccessToken } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, SigninData>({
        mutationFn: (payload) => AuthApi.signin(payload),
        onSuccess: async (res) => {
            setAccessToken(res.accessToken);
            queryClient.setQueryData(['me'], res.user);
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
}

export function useGoogleSignin() {
    const { setAccessToken } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, { idToken: string }>({
        mutationFn: (payload) => AuthApi.googleSignin(payload.idToken),
        onSuccess: async (res) => {
            setAccessToken(res.accessToken);
            queryClient.setQueryData(['me'], res.user);
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
}

export function useMe() {
    const { accessToken } = useAuthStore();

    return useQuery({
        queryKey: ['me'],
        queryFn: AuthApi.me,
        retry: false,
        enabled: !!accessToken,
    });
}

export function useSignup() {
    return useMutation<MeResponse, Error, SignupData>({
        mutationFn: (payload) => AuthApi.signup(payload),
    });
}

export function useSignout() {
    const { clearAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: () => AuthApi.signout(),
        onSuccess: () => {
            // Reset auth store
            clearAuth();
            // Clear all cached data
            queryClient.clear();
            // 3. force UX clean state
            globalThis.location.href = '/auth/signin';
        },
    });
}

export function useRefreshToken() {
    const { setAccessToken, accessToken } = useAuthStore();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['refresh_token'],
        queryFn: async () => {
            const res = await AuthApi.refresh();
            setAccessToken(res.accessToken);
            if (res.user) {
                queryClient.setQueryData(['me'], res.user);
            }
            return res;
        },
        retry: false,
        enabled: !accessToken,
    });
}
