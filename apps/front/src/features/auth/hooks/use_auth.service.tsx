import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../api/auth.api';
import type { AuthResponse, MeResponse, SigninData, SignupData } from '../types/types';
import { useAuthStore } from '../store/auth.store';

export function useSignin() {
    const { setAccessToken } = useAuthStore();
    const queryClient = useQueryClient();

    const meQuery = useMe();

    return useMutation<AuthResponse, Error, SigninData>({
        mutationFn: (payload) => AuthApi.signin(payload),
        onSuccess: async (res) => {
            setAccessToken(res.accessToken);
            queryClient.invalidateQueries({ queryKey: ['session'] });

            await meQuery.refetch();
        },
    });
}

export function useMe() {
    const { setUser } = useAuthStore();

    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const data = await AuthApi.me();
            setUser(data);
            return data;
        },
        retry: false,
        enabled: false,
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
            clearAuth();
            queryClient.removeQueries({ queryKey: ['session'] });
        },
    });
}

export function useRefreshToken() {
    const { setAccessToken, accessToken } = useAuthStore();

    return useQuery({
        queryKey: ['refresh_token'],
        queryFn: async () => {
            const res = await AuthApi.refresh();
            setAccessToken(res.accessToken);
            return res;
        },
        retry: false,
        enabled: !accessToken,
    });
}
