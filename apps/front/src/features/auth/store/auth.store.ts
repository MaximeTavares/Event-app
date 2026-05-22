import { create } from 'zustand';
import type { MeResponse } from '../types/types';

interface AuthState {
    user: MeResponse | null;
    accessToken: string | null;
    setUser: (user: MeResponse | null) => void;
    setAccessToken: (token: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => {
    return {
        user: null,
        accessToken: null,

        setUser: (user) => set({ user }),
        setAccessToken: (token) => set({ accessToken: token }),
        clearAuth: () => set({ user: null, accessToken: null }),
    };
});
