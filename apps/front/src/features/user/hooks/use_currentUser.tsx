import { useMe } from '@/features/auth/hooks/use_auth.service';
import { useProfile } from '@/features/settings/hooks/use-profile';

export function useCurrentUser() {
    const { data: user, isLoading: isLoadingUser } = useMe();
    const { data: profile, isLoading: isLoadingProfile } = useProfile();

    return {
        user: {
            id: user?.id,
            name: profile?.firstName,
            email: user?.email,
            avatar: profile?.avatarUrl,
        },
        isLoading: isLoadingUser || isLoadingProfile,
    };
}
