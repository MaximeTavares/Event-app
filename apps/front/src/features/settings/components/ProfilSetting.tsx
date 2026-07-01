import { ProfileDto } from '@app/contracts';
import { ProfileForm } from './ProfileForm';
import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { toastMutation } from '../../../shared/utils/useToastMutation';
import { SkeletonLoading } from '../../../shared/components/UI/states/SkeletonLoading';
import { useProfile, useUpdateProfile } from '../hooks/use-profile';

export default function ProfilSetting() {
    const { data: profile, isPending, isError } = useProfile();
    const updateProfile = useUpdateProfile();

    const handleFormSubmit = async (data: ProfileDto) => {
        await toastMutation(
            updateProfile.mutateAsync({
                firstName: data.firstName,
                lastName: data.lastName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
                phone: data.phone?.trim() || undefined,
                address: data.address,
            }),
            {
                loading: 'Chargement...',
                success: 'Profil modifié',
                error: "Impossible d'enregistrer",
            },
        );
    };

    if (isPending) {
        return <SkeletonLoading />;
    }

    if (isError || !profile) {
        return <ErrorAlert message="Impossible de charger votre profil" />;
    }

    return (
        <ProfileForm
            defaultValues={profile}
            onSubmit={handleFormSubmit}
            error={
                updateProfile.isError ? "Impossible d'enregistrer les modifications." : undefined
            }
            isSubmitting={updateProfile.isPending}
        />
    );
}
