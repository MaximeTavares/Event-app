import { ProfileDto, ProfileFormValues, profileSchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/UI/Button';
import { FormField } from '../../../shared/components/UI/formField/FormField';

type ProfileFormProps = {
    onSubmit: (data: ProfileDto) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
    defaultValues: ProfileDto;
};

export function ProfileForm({
    onSubmit,
    isSubmitting,
    error,
    defaultValues,
}: Readonly<ProfileFormProps>) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    // const coordinates = data?.profile.address.coordinates;

    return (
        <form className="flex max-w-xl flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold">Profil</h2>

            <FormField
                label="Prénom"
                error={errors.firstName?.message}
                {...register('firstName')}
            />

            <FormField label="Nom" error={errors.lastName?.message} {...register('lastName')} />

            <FormField
                type="tel"
                label="Téléphone"
                error={errors.phone?.message}
                {...register('phone')}
            />

            {/* <FormField
                    type="url"
                    label="Avatar"
                    error={errors.avatarUrl?.message}
                    {...register('avatarUrl')}
                /> */}

            <FormField
                as="textarea"
                label="Bio"
                error={errors.bio?.message}
                rows={4}
                {...register('bio')}
            />

            <fieldset className="flex flex-col gap-3 rounded-lg border border-base-300 p-4">
                <legend className="px-1 text-sm font-medium">Adresse</legend>

                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        label="N° de rue"
                        error={errors.address?.streetNumber?.message}
                        {...register('address.streetNumber')}
                    />
                    <FormField
                        label="Rue"
                        error={errors.address?.streetName?.message}
                        {...register('address.streetName')}
                    />
                </div>

                <FormField
                    label="Complément"
                    error={errors.address?.addressLine2?.message}
                    {...register('address.addressLine2')}
                />

                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        label="Ville"
                        error={errors.address?.city?.message}
                        {...register('address.city')}
                    />
                    <FormField
                        label="Code postal"
                        error={errors.address?.postalCode?.message}
                        {...register('address.postalCode')}
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

            {error && <p className="text-error text-sm">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
        </form>
    );
}
