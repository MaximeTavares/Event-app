import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SettingsApi } from '../api/settings.api';
import { useAuthStore } from '../../auth/store/auth.store';
import {
    AvailabilityDto,
    ChangePasswordDto,
    MeSettingsDto,
    NotificationsDto,
    PreferencesDto,
    ProfileDto,
    SecurityDto,
} from '@app/contracts';

export function useSettings() {
    const { accessToken } = useAuthStore();

    return useQuery({
        queryKey: ['settings'],
        queryFn: () => SettingsApi.get(),
        retry: false,
        staleTime: 5 * 60 * 1000,
        enabled: !!accessToken,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ProfileDto) => SettingsApi.updateProfile(payload),
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData<MeSettingsDto>(['settings'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    profile: {
                        ...old.profile,
                        ...updatedProfile,
                    },
                };
            });
        },
    });
}

export function useUpdateAvailability() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AvailabilityDto) => SettingsApi.updateAvailability(payload),

        onSuccess: (updatedAvailability) => {
            queryClient.setQueryData<MeSettingsDto>(['settings'], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    availability: updatedAvailability,
                };
            });
        },
    });
}

export function useUpdateNotifications() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: NotificationsDto) => SettingsApi.updateNotifications(payload),
        onSuccess: (updatedNotifications) => {
            queryClient.setQueryData<MeSettingsDto>(['settings'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    notifications: {
                        ...old.notifications,
                        ...updatedNotifications,
                    },
                };
            });
        },
    });
}

export function useUpdatePreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PreferencesDto) => SettingsApi.updatePreferences(payload),
        onSuccess: (updatedPreferences) => {
            queryClient.setQueryData<MeSettingsDto>(['settings'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    preferences: {
                        ...old.preferences,
                        ...updatedPreferences,
                    },
                };
            });
        },
    });
}

export function useUpdateSecurity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SecurityDto) => SettingsApi.updateSecurity(payload),
        onSuccess: (updatedSecurity) => {
            queryClient.setQueryData<MeSettingsDto>(['settings'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    security: {
                        ...old.security,
                        ...updatedSecurity,
                    },
                };
            });
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (payload: ChangePasswordDto) => SettingsApi.changePassword(payload),
        retry: false,
    });
}
