import { NotificationsDto } from '@app/contracts';
import { useSettingsSection, useUpdateSettingsSection } from './use-settings-section';

export const useNotifications = () => useSettingsSection<NotificationsDto>('notifications');
export const useUpdateNotifications = () =>
    useUpdateSettingsSection<NotificationsDto>('notifications');
