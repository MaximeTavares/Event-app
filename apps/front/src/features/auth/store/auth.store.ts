import { create } from 'zustand';

interface AuthState {
    accessToken: string | null;

    initialized: boolean;

    setAccessToken: (token: string | null) => void;
    setInitialized: (value: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    accessToken: null,

    initialized: false,

    setAccessToken: (token) => set({ accessToken: token }),

    setInitialized: (value) => set({ initialized: value }),

    clearAuth: () =>
        set({
            accessToken: null,
        }),
}));
