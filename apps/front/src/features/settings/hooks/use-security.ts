import { SecurityDto } from '@app/contracts';
import { useSettingsSection, useUpdateSettingsSection } from './use-settings-section';

export const useSecurity = () => useSettingsSection<SecurityDto>('security');
export const useUpdateSecurity = () => useUpdateSettingsSection<SecurityDto>('security');
