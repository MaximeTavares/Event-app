import { ProfileDto, ProfileFormValues, profileSchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormField } from '../../../shared/components/UI/formField/FormField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
    className,
    ...props
}: Readonly<ProfileFormProps & React.ComponentProps<'div'>>) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    // const coordinates = data?.profile.address.coordinates;

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Profil</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        // className="flex max-w-xl flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <FieldGroup>
                            <Field className="grid grid-cols-2 gap-4">
                                <Field data-invalid={!!errors.firstName}>
                                    <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
                                    <Input
                                        {...register('firstName')}
                                        aria-invalid={!!errors.firstName}
                                    />
                                    {errors.firstName && <FieldError errors={[errors.firstName]} />}
                                </Field>

                                <Field data-invalid={!!errors.lastName}>
                                    <FieldLabel htmlFor="lastName">Nom</FieldLabel>
                                    <Input
                                        {...register('lastName')}
                                        aria-invalid={!!errors.lastName}
                                    />
                                    {errors.lastName && <FieldError errors={[errors.lastName]} />}
                                </Field>
                            </Field>

                            <Field data-invalid={!!errors.phone}>
                                <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                                <Input
                                    {...register('phone')}
                                    type="tel"
                                    aria-invalid={!!errors.phone}
                                />
                                {errors.phone && <FieldError errors={[errors.phone]} />}
                            </Field>

                            <Field data-invalid={!!errors.bio}>
                                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                <Textarea {...register('bio')} aria-invalid={!!errors.bio} />
                                {errors.bio && <FieldError errors={[errors.bio]} />}
                            </Field>

                            <fieldset className="flex flex-col gap-3 rounded-lg border border-base-300 shadow p-4">
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

                            <Button disabled={isSubmitting || !isDirty}>
                                {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
