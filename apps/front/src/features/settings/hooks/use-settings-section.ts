import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SettingsApi } from '../api/settings.api';
import { useAuthStore } from '../../auth/store/auth.store';
import { ChangePasswordDto, SettingsList } from '@app/contracts';
import { queryKeys } from '@/shared/tanstack/QueryKeys';

export function useSettingsSection<T>(section: SettingsList) {
    const { accessToken } = useAuthStore();

    return useQuery<T>({
        queryKey: queryKeys.setting(section),
        queryFn: () => SettingsApi.getSection<T>(section),
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
    });
}

export function useUpdateSettingsSection<T>(section: SettingsList) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: T) => SettingsApi.updateSection<T>(section, payload),
        onSuccess: (updated: T) => {
            queryClient.setQueryData(queryKeys.setting(section), updated);
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (payload: ChangePasswordDto) => SettingsApi.changePassword(payload),
        retry: false,
    });
}
