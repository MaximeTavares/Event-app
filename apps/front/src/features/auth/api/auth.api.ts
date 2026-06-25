import { api } from '../../../shared/utils/axios-client';
import {
    LoginResponseDto,
    CurrentUserData,
    LoginRequestDto,
    SignupRequestDto,
} from '@app/contracts';

export class AuthApi {
    static async signin(body: LoginRequestDto) {
        const { data } = await api.post<Omit<LoginResponseDto, 'refreshToken'>>(
            'ms/auth/signin',
            body,
        );

        return data;
    }

    static async googleSignin(code: string) {
        const { data } = await api.post<Omit<LoginResponseDto, 'refreshToken'>>('ms/auth/google', {
            code,
        });

        return data;
    }

    static async signup(body: SignupRequestDto): Promise<void> {
        await api.post('ms/auth/signup', body);
    }

    static async me() {
        const { data } = await api.get<CurrentUserData>('ms/auth/me');
        return data;
    }

    static async refresh() {
        const { data } = await api.post<{ accessToken: string }>(`ms/auth/refresh_token`, {
            withCredentials: true,
        });
        return data;
    }

    static async signout(): Promise<void> {
        await api.post('ms/auth/signout', {}, { withCredentials: true });
    }
}
