import { create } from 'zustand';
import type { SettingsNavOption } from '../types/types';

export const settingsNavOptions: SettingsNavOption[] = [
    { id: 'profil', label: 'Profil', path: 'profil' },
    { id: 'disponibilites', label: 'Mes disponibilités', path: 'disponibilites' },
    { id: 'securite', label: 'Sécurité', path: 'securite' },
    { id: 'notifications', label: 'Notifications', path: 'notifications' },
    { id: 'preferences', label: 'Préférences', path: 'preferences' },
];

interface SettingsStore {
    navOptions: SettingsNavOption[];
}

export const useSettingsStore = create<SettingsStore>(() => ({
    navOptions: settingsNavOptions,
}));
