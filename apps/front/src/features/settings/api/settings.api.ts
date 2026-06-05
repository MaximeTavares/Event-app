import { api } from '../../../shared/utils/axios-client';
import type {
    ChangePasswordPayload,
    MeSettings,
    UpdateAvailabilityPayload,
    UpdateNotificationsPayload,
    UpdatePreferencesPayload,
    UpdateProfilePayload,
    UpdateSecurityPayload,
} from '../types/types';

export class SettingsApi {
    static async get(): Promise<MeSettings> {
        const { data } = await api.get<MeSettings>('me/settings');
        return data;
    }

    static async updateProfile(body: UpdateProfilePayload): Promise<UpdateProfilePayload> {
        const { data } = await api.patch('me/settings/profile', body);
        return data;
    }

    static async updatePreferences(
        body: UpdatePreferencesPayload,
    ): Promise<UpdatePreferencesPayload> {
        const { data } = await api.patch('me/settings/preferences', body);
        return data;
    }

    static async updateNotifications(
        body: UpdateNotificationsPayload,
    ): Promise<UpdateNotificationsPayload> {
        const { data } = await api.patch('me/settings/notifications', body);
        return data;
    }

    static async updateSecurity(body: UpdateSecurityPayload): Promise<UpdateSecurityPayload> {
        const { data } = await api.patch('me/settings/security', body);
        return data;
    }

    static async updateAvailability(
        body: UpdateAvailabilityPayload,
    ): Promise<UpdateAvailabilityPayload> {
        const { data } = await api.patch('me/settings/availability', body);
        return data;
    }

    static async changePassword(body: ChangePasswordPayload): Promise<void> {
        await api.post('me/settings/password', body);
    }
}
