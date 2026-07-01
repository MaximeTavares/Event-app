import { ProfileDto, ProfileFormValues, profileSchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
}: Readonly<ProfileFormProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>>) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Profil</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
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

                            <fieldset className="flex flex-col gap-3 rounded-lg border p-4">
                                <legend className="px-1 text-sm font-medium">Adresse</legend>

                                <Field className="grid grid-cols-2 gap-3">
                                    <Field data-invalid={!!errors.address?.streetNumber}>
                                        <FieldLabel htmlFor="streetNumber">N° de rue</FieldLabel>
                                        <Input
                                            {...register('address.streetNumber')}
                                            id="streetNumber"
                                            aria-invalid={!!errors.address?.streetNumber}
                                        />
                                        {errors.address?.streetNumber && (
                                            <FieldError errors={[errors.address.streetNumber]} />
                                        )}
                                    </Field>

                                    <Field data-invalid={!!errors.address?.streetName}>
                                        <FieldLabel htmlFor="streetName">Rue</FieldLabel>
                                        <Input
                                            {...register('address.streetName')}
                                            id="streetName"
                                            aria-invalid={!!errors.address?.streetName}
                                        />
                                        {errors.address?.streetName && (
                                            <FieldError errors={[errors.address.streetName]} />
                                        )}
                                    </Field>
                                </Field>

                                <Field data-invalid={!!errors.address?.addressLine2}>
                                    <FieldLabel htmlFor="addressLine2">Complément</FieldLabel>
                                    <Input
                                        {...register('address.addressLine2')}
                                        id="addressLine2"
                                        aria-invalid={!!errors.address?.addressLine2}
                                    />
                                    {errors.address?.addressLine2 && (
                                        <FieldError errors={[errors.address.addressLine2]} />
                                    )}
                                </Field>

                                <Field className="grid grid-cols-2 gap-3">
                                    <Field data-invalid={!!errors.address?.city}>
                                        <FieldLabel htmlFor="city">Ville</FieldLabel>
                                        <Input
                                            {...register('address.city')}
                                            id="city"
                                            aria-invalid={!!errors.address?.city}
                                        />
                                        {errors.address?.city && (
                                            <FieldError errors={[errors.address.city]} />
                                        )}
                                    </Field>

                                    <Field data-invalid={!!errors.address?.postalCode}>
                                        <FieldLabel htmlFor="postalCode">Code postal</FieldLabel>
                                        <Input
                                            {...register('address.postalCode')}
                                            id="postalCode"
                                            aria-invalid={!!errors.address?.postalCode}
                                        />
                                        {errors.address?.postalCode && (
                                            <FieldError errors={[errors.address.postalCode]} />
                                        )}
                                    </Field>
                                </Field>

                                <Field data-invalid={!!errors.address?.country}>
                                    <FieldLabel htmlFor="country">Pays</FieldLabel>
                                    <Input
                                        {...register('address.country')}
                                        id="country"
                                        aria-invalid={!!errors.address?.country}
                                    />
                                    {errors.address?.country && (
                                        <FieldError errors={[errors.address.country]} />
                                    )}
                                </Field>
                            </fieldset>

                            {error && <p className="text-error text-sm">{error}</p>}
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        type="submit"
                        form="profile-form"
                        disabled={isSubmitting || !isDirty}
                    >
                        {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
