import { PreferencesDto } from '@app/contracts';
import { useSettingsSection, useUpdateSettingsSection } from './use-settings-section';

export const usePreferences = () => useSettingsSection<PreferencesDto>('preferences');
export const useUpdatePreferences = () => useUpdateSettingsSection<PreferencesDto>('preferences');
