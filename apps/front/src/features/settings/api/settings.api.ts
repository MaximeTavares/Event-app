import { api } from '../../../shared/utils/axios-client';
import type { ChangePasswordPayload, MeSettings, PatchSettingsPayload } from '../types/types';

type SettingsEnvelope<T> = {
    data: T;
    timeStamp?: string;
    url?: string;
};

export class SettingsApi {
    static async get(): Promise<MeSettings> {
        const { data } = await api.get<SettingsEnvelope<MeSettings>>('me/settings');
        return data.data;
    }

    static async patch(body: PatchSettingsPayload): Promise<MeSettings> {
        const { data } = await api.patch<SettingsEnvelope<MeSettings>>('me/settings', body);
        return data.data;
    }

    static async changePassword(body: ChangePasswordPayload): Promise<void> {
        await api.post('me/settings/password', body);
    }
}
