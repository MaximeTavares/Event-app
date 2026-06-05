import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import Button from '../../../shared/components/UI/Button';
import {
    profileSchema,
    type ProfileInputValues,
    type ProfileOutputValues,
} from '../validation/profile.schema';
import { useSettings, useUpdateProfile } from '../hooks/use_settings.service';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ProfilSetting() {
    const { data, isPending, isError, refetch } = useSettings();
    const updateProfile = useUpdateProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileInputValues, unknown, ProfileOutputValues>({
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
        defaultValues: data?.profile,
    });

    useEffect(() => {
        if (data?.profile) {
            reset(data.profile);
        }
    }, [data, reset]);

    if (isPending) {
        return <p className="text-base-content/70">Chargement du profil…</p>;
    }

    if (isError) {
        return (
            <div className="flex flex-col gap-3">
                <p className="text-error">Impossible de charger vos paramètres.</p>
                <button
                    type="button"
                    className="btn btn-outline btn-sm w-fit"
                    onClick={() => refetch()}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // const coordinates = data?.profile.address.coordinates;

    return (
        <form
            className="flex max-w-xl flex-col gap-4"
            onSubmit={handleSubmit((values) => {
                updateProfile.mutate({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    skills: values.skills,
                    address: values.address,
                });
            })}
        >
            <h2 className="text-xl font-semibold">Profil</h2>

            <FormField
                label="Prénom"
                error={errors.firstName?.message}
                {...register('firstName')}
            />

            <FormField label="Nom" error={errors.lastName?.message} {...register('lastName')} />

            <FormField
                type="email"
                label="Email"
                error={errors.email?.message}
                {...register('email')}
            />

            <fieldset className="flex flex-col gap-3 rounded-lg border border-base-300 p-4">
                <legend className="px-1 text-sm font-medium">Adresse</legend>

                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        label="N° de rue"
                        error={errors.address?.street_number?.message}
                        {...register('address.street_number')}
                    />
                    <FormField
                        label="Rue"
                        error={errors.address?.street_name?.message}
                        {...register('address.street_name')}
                    />
                </div>

                <FormField
                    label="Complément"
                    error={errors.address?.address_line_2?.message}
                    {...register('address.address_line_2')}
                />

                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        label="Ville"
                        error={errors.address?.city?.message}
                        {...register('address.city')}
                    />
                    <FormField
                        label="Code postal"
                        error={errors.address?.postal_code?.message}
                        {...register('address.postal_code')}
                    />
                </div>

                <FormField
                    label="Pays"
                    error={errors.address?.country?.message}
                    {...register('address.country')}
                />

                {/* {coordinates ? (
                    <p className="text-xs text-base-content/60">
                        Coordonnées : {coordinates.lat.toFixed(5)}, {coordinates.lon.toFixed(5)}
                    </p>
                ) : null} */}
            </fieldset>

            <FormField
                as="textarea"
                label="Compétences"
                error={errors.skills?.message}
                rows={4}
                {...register('skills')}
            />

            <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
        </form>
    );
}
