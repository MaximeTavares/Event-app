import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { SettingsApi } from '../api/settings.api';
import type { ChangePasswordPayload, MeSettings, PatchSettingsPayload } from '../types/types';

export function useSettings() {
    return useQuery({
        queryKey: ['settings'],
        queryFn: () => SettingsApi.get(),
    });
}

export function usePatchSettings() {
    const queryClient = useQueryClient();

    return useMutation<MeSettings, Error, PatchSettingsPayload>({
        mutationFn: (payload) => SettingsApi.patch(payload),
        onSuccess: (next) => {
            queryClient.setQueryData(['settings'], next);
            toast.success('Paramètres enregistrés.');
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
