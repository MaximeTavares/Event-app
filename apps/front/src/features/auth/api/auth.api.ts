import type { AuthResponse, MeResponse, SigninData, SignupData } from '../types/types';
import { api } from '../../../shared/utils/axios-client';

export class AuthApi {
    static async signin(body: SigninData): Promise<AuthResponse> {
        const { data } = await api.post('ms/auth/signin', body);

        return data;
    }

    static async signup(body: SignupData): Promise<MeResponse> {
        const { data } = await api.post('ms/auth/signup', body);

        return data;
    }

    static async me(): Promise<MeResponse> {
        const { data } = await api.get<MeResponse>('ms/auth/me');
        console.log('🚀 ~ AuthApi ~ me ~ data:', data);
        return data;
    }

    static async refresh(): Promise<AuthResponse> {
        const { data } = await api.post(`ms/auth/refresh_token`, {
            withCredentials: true,
        });
        console.log('🚀 ~ AuthApi ~ refresh ~ data:', data);

        return data;
    }

    static async signout(): Promise<void> {
        await api.post('ms/auth/signout', {}, { withCredentials: true });
    }
}
