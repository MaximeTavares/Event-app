import { AvailabilityDto, MeSettingsDto, ProfileDto } from '@app/contracts';
import { api } from '../../../shared/utils/axios-client';
import type {
    ChangePasswordPayload,
    UpdateNotificationsPayload,
    UpdatePreferencesPayload,
    UpdateSecurityPayload,
} from '../types/types';

export class SettingsApi {
    static async get() {
        const { data } = await api.get<MeSettingsDto>('me/settings');
        return data;
    }

    static async updateProfile(body: ProfileDto) {
        const { data } = await api.patch<ProfileDto>('me/profile', body);
        return data;
    }

    static async updatePreferences(
        body: UpdatePreferencesPayload,
    ): Promise<UpdatePreferencesPayload> {
        const { data } = await api.patch('me/preferences', body);
        return data;
    }

    static async updateNotifications(
        body: UpdateNotificationsPayload,
    ): Promise<UpdateNotificationsPayload> {
        const { data } = await api.patch('me/notifications', body);
        return data;
    }

    static async updateSecurity(body: UpdateSecurityPayload): Promise<UpdateSecurityPayload> {
        const { data } = await api.patch('me/security', body);
        return data;
    }

    static async updateAvailability(body: AvailabilityDto) {
        const { data } = await api.patch<AvailabilityDto>('me/availability', body);
        return data;
    }

    static async changePassword(body: ChangePasswordPayload): Promise<void> {
        await api.post('me/settings/password', body);
    }
}
