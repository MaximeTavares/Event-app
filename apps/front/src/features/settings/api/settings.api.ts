import { ChangePasswordDto, SettingsList } from '@app/contracts';
import { api } from '../../../shared/utils/axios-client';

export class SettingsApi {
    static async getSection<T>(section: SettingsList): Promise<T> {
        const { data } = await api.get<T>(`me/${section}`);
        return data;
    }

    static async updateSection<T>(section: SettingsList, body: T): Promise<T> {
        const { data } = await api.patch<T>(`me/${section}`, body);
        return data;
    }

    static async changePassword(body: ChangePasswordDto): Promise<void> {
        await api.post('me/password', body);
    }
}
