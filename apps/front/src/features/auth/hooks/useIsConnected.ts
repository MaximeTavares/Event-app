import { useAuthStore } from '../store/auth.store';

export function useIsConnected() {
    return useAuthStore((s) => s.initialized && !!s.accessToken);
}
