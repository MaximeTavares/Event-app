import { useSettings, useUpdateProfile } from '../hooks/use_settings.service';
import { ProfileDto } from '@app/contracts';
import { ProfileForm } from './ProfileForm';
import { ErrorAlert } from '../../../shared/components/UI/states/ErrorAlert';
import { toastMutation } from '../../../shared/utils/useToastMutation';

export default function ProfilSetting() {
    const { data, isPending, isError } = useSettings();
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
        return <p className="text-base-content/70">Chargement du profil…</p>;
    }

    if (isError || !data) {
        return <ErrorAlert message="Impossible de charger votre profil" />;
    }

    return (
        <ProfileForm
            defaultValues={data.profile}
            onSubmit={handleFormSubmit}
            error={
                updateProfile.isError ? "Impossible d'enregistrer les modifications." : undefined
            }
            isSubmitting={updateProfile.isPending}
        />
    );
}
