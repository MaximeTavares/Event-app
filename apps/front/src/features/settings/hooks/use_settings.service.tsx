import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { SettingsApi } from '../api/settings.api';
import type { ChangePasswordPayload, MeSettings, UpdateSecurityPayload } from '../types/types';
import { useAuthStore } from '../../auth/store/auth.store';
import {
    AvailabilityDto,
    MeSettingsDto,
    NotificationsDto,
    PreferencesDto,
    ProfileDto,
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

    return useMutation<UpdateSecurityPayload, Error, UpdateSecurityPayload>({
        mutationFn: (payload) => SettingsApi.updateSecurity(payload),
        onSuccess: (updatedSecurity) => {
            queryClient.setQueryData(['settings'], (old: MeSettings | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    ...updatedSecurity,
                };
            });
            toast.success('Securité mis à jour');
        },
        onError: () => {
            toast.error("Impossible d'enregistrer les paramètres.");
        },
    });
}

export function useChangePassword() {
    return useMutation<void, Error, ChangePasswordPayload>({
        mutationFn: (payload) => SettingsApi.changePassword(payload),
        onSuccess: () => {
            toast.success('Mot de passe mis à jour.');
        },
        onError: () => {
            toast.error('Impossible de mettre à jour le mot de passe.');
        },
    });
}
