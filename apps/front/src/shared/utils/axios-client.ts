import axios, { type AxiosInstance } from 'axios';
import { AuthApi } from '../../features/auth/api/auth.api';
import { useAuthStore } from '../../features/auth/store/auth.store';

function axiosClient(): AxiosInstance {
	const api = axios.create({
		baseURL: `${import.meta.env.VITE_API_URL}/`,
		withCredentials: true,
	});

	let refreshPromise: Promise<string> | null = null;

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
			// 429 - Rate limit
			if (error.response?.status === 429) {
				const retryAfter = error.response.headers['retry-after'];
				const seconds = retryAfter
					? Number.parseInt(retryAfter, 10)
					: 60;
				return Promise.reject(
					new Error(
						`Trop de tentatives. Réessayez dans ${seconds} secondes.`,
					),
				);
			}

			// 401 - Token expiré
			if (error.response?.status === 401 && !error.config._retry) {
				error.config._retry = true;

				if (!refreshPromise) {
					refreshPromise = AuthApi.refresh()
						.then(({ data: { accessToken, user } }) => {
							useAuthStore.getState().setAccessToken(accessToken);
							useAuthStore.getState().setUser(user);
							return accessToken;
						})
						.catch((err) => {
							useAuthStore.getState().clearAuth();
							window.location.href = '/auth/signin';
							throw err;
						})
						.finally(() => {
							refreshPromise = null;
						});
				}

				const accessToken: string = await refreshPromise;
				error.config.headers.Authorization = `Bearer ${accessToken}`;
				return api(error.config);
			}

			return Promise.reject(error);
		},
	);

	return api;
}

export const api = axiosClient();
