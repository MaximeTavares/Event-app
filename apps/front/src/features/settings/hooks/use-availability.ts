import { AvailabilityDto } from '@app/contracts';
import { useSettingsSection, useUpdateSettingsSection } from './use-settings-section';

export const useAvailability = () => useSettingsSection<AvailabilityDto>('availability');
export const useUpdateAvailability = () =>
    useUpdateSettingsSection<AvailabilityDto>('availability');
