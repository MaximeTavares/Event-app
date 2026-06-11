import {
    AvailabilityDto,
    ChangePasswordDto,
    MeSettingsDto,
    NotificationsDto,
    PreferencesDto,
    ProfileDto,
    SecurityDto,
} from '@app/contracts';
import { api } from '../../../shared/utils/axios-client';

export class SettingsApi {
    static async get() {
        const { data } = await api.get<MeSettingsDto>('me/settings');
        return data;
    }

    static async updateProfile(body: ProfileDto) {
        const { data } = await api.patch<ProfileDto>('me/profile', body);
        return data;
    }

    static async updatePreferences(body: PreferencesDto) {
        const { data } = await api.patch<PreferencesDto>('me/preferences', body);
        return data;
    }

    static async updateNotifications(body: NotificationsDto) {
        const { data } = await api.patch<NotificationsDto>('me/notifications', body);
        return data;
    }

    static async updateSecurity(body: SecurityDto) {
        const { data } = await api.patch<SecurityDto>('me/security', body);
        return data;
    }

    static async updateAvailability(body: AvailabilityDto) {
        const { data } = await api.patch<AvailabilityDto>('me/availability', body);
        return data;
    }

    static async changePassword(body: ChangePasswordDto): Promise<void> {
        await api.post('me/password', body);
    }
}
