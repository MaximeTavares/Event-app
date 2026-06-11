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
        onSuccess: async (updatedProfile) => {
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
            await queryClient.invalidateQueries({
                queryKey: ['settings'],
                refetchType: 'inactive',
            });
        },
    });
}

export function useUpdateAvailability() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AvailabilityDto) => SettingsApi.updateAvailability(payload),

        onSuccess: async (updatedAvailability) => {
            queryClient.setQueryData<MeSettingsDto>(['settings'], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    availability: updatedAvailability,
                };
            });
            await queryClient.invalidateQueries({
                queryKey: ['settings'],
                refetchType: 'inactive',
            });
        },
    });
}

export function useUpdateNotifications() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: NotificationsDto) => SettingsApi.updateNotifications(payload),
        onSuccess: async (updatedNotifications) => {
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

            await queryClient.invalidateQueries({
                queryKey: ['settings'],
                refetchType: 'inactive',
            });
        },
    });
}

export function useUpdatePreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PreferencesDto) => SettingsApi.updatePreferences(payload),
        onSuccess: async (updatedPreferences) => {
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
            await queryClient.invalidateQueries({
                queryKey: ['settings'],
                refetchType: 'inactive',
            });
        },
    });
}

export function useUpdateSecurity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SecurityDto) => SettingsApi.updateSecurity(payload),
        onSuccess: async (updatedSecurity) => {
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
            await queryClient.invalidateQueries({
                queryKey: ['settings'],
                refetchType: 'inactive',
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
