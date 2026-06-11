import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { LoginRequestDto, SignupRequestDto } from '@app/contracts';

export function useSignin() {
    const { setAccessToken } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LoginRequestDto) => AuthApi.signin(payload),
        onSuccess: async (res) => {
            setAccessToken(res.accessToken);
            await queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
}

export function useGoogleSignin() {
    const { setAccessToken } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { idToken: string }) => AuthApi.googleSignin(payload.idToken),
        onSuccess: async (res) => {
            setAccessToken(res.accessToken);
            await queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
}

export function useMe() {
    const { accessToken, initialized } = useAuthStore();

    return useQuery({
        queryKey: ['me'],
        queryFn: () => AuthApi.me(),
        retry: false,
        enabled: initialized && !!accessToken,

        staleTime: 5 * 60 * 1000, // 5 min
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

export function useSignup() {
    return useMutation({
        mutationFn: (payload: SignupRequestDto) => AuthApi.signup(payload),
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
    const { setAccessToken, accessToken, initialized } = useAuthStore();

    return useQuery({
        queryKey: ['refresh_token'],
        queryFn: async () => {
            const res = await AuthApi.refresh();

            setAccessToken(res.accessToken);

            return res;
        },
        retry: false,

        enabled: initialized && !accessToken,
    });
}
