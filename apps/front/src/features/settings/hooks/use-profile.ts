import { ProfileDto } from '@app/contracts';
import { useSettingsSection, useUpdateSettingsSection } from './use-settings-section';

export const useProfile = () => useSettingsSection<ProfileDto>('profile');
export const useUpdateProfile = () => useUpdateSettingsSection<ProfileDto>('profile');
