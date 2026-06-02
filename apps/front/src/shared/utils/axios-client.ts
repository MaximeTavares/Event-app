import axios, { type AxiosInstance } from 'axios';
import { AuthApi } from '../../features/auth/api/auth.api';
import { useAuthStore } from '../../features/auth/store/auth.store';

function axiosClient(): AxiosInstance {
    const api = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/`,
        withCredentials: true,
    });

    let refreshPromise: Promise<string> | null = null;

    const isAuthRoute = (url?: string) => {
        if (!url) return false;
        return url.includes('/auth/');
    };

    api.interceptors.request.use((config) => {
        const { accessToken } = useAuthStore.getState();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });

    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config;

            // 429 - Rate limit
            if (error.response?.status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                const seconds = retryAfter ? Number.parseInt(retryAfter, 10) : 60;
                throw new Error(
                    `Trop de tentatives. Réessayez dans ${seconds} secondes.`,
                );
            }

            // ❌ DO NOT HANDLE AUTH ROUTES
            if (isAuthRoute(originalRequest?.url)) {
                throw error;
            }

            // ❌ NO ACCESS TOKEN = NO REFRESH
            const { accessToken } = useAuthStore.getState();
            if (!accessToken) {
                throw error;
            }

            // 401 - Token expired
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
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

                    const accessToken = await refreshPromise;

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    return api(originalRequest);
                } catch (err) {
                    throw err;
                }
            }

            throw error;
        },
    );

    return api;
}

export const api = axiosClient();