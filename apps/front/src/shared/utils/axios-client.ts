import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { AuthApi } from '../../features/auth/api/auth.api';
import { useAuthStore } from '../../features/auth/store/auth.store';

type RetryAxiosRequest = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

function axiosClient(): AxiosInstance {
    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/`,
        withCredentials: true,
    });

    let refreshPromise: Promise<string> | null = null;

    const isAuthRoute = (url?: string): boolean => {
        return typeof url === 'string' && url.includes('/auth/');
    };

    // =========================
    // REQUEST INTERCEPTOR
    // =========================
    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore.getState();

        if (accessToken) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });

    // =========================
    // RESPONSE INTERCEPTOR
    // =========================
    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config;

            if (!originalRequest) {
                throw error;
            }

            const request = originalRequest as RetryAxiosRequest;

            // =========================
            // RATE LIMIT (429)
            // =========================
            if (error.response?.status === 429) {
                const retryAfter = error.response?.headers?.['retry-after'];
                const seconds = retryAfter ? Number.parseInt(String(retryAfter), 10) : 60;

                throw new Error(`Trop de tentatives. Réessayez dans ${seconds} secondes.`);
            }

            // =========================
            // DO NOT HANDLE AUTH ROUTES
            // =========================
            if (isAuthRoute(request.url)) {
                throw error;
            }

            const { accessToken } = useAuthStore.getState();

            if (!accessToken) {
                throw error;
            }

            // =========================
            // REFRESH TOKEN FLOW
            // =========================
            if (error.response?.status === 401 && !request._retry) {
                request._retry = true;

                refreshPromise ??= AuthApi.refresh()
                    .then((data) => {
                        useAuthStore.getState().setAccessToken(data.accessToken);
                        return data.accessToken;
                    })
                    .catch((err) => {
                        useAuthStore.getState().clearAuth();
                        globalThis.location.href = '/auth/signin';
                        throw err;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });

                const newAccessToken = await refreshPromise;

                request.headers = request.headers ?? {};
                request.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(request);
            }

            throw error;
        },
    );

    return api;
}

export const api = axiosClient();
