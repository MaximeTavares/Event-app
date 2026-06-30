import { useForm } from 'react-hook-form';
import {
    eventCreationSchema,
    type EventCreationFormValues,
} from '../validation/eventCreation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventStatusLabel, eventStatusOptions } from '../types/event.type';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EventCreationFormProps = {
    onSubmit: (data: EventCreationFormValues) => Promise<void>;
    isSubmitting?: boolean;
    error?: string | null;
};

export function EventCreationForm({
    onSubmit,
    isSubmitting,
    error,
    className,
    ...props
}: Readonly<EventCreationFormProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>>) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty, isValid },
    } = useForm<EventCreationFormValues>({
        resolver: zodResolver(eventCreationSchema),
        mode: 'onChange',
        defaultValues: {
            status: 'DRAFT',
        },
    });

    const status = watch('status');

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Créer un évènement</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <FieldGroup>
                            <Field data-invalid={!!errors.title}>
                                <FieldLabel htmlFor="title">Titre</FieldLabel>
                                <Input
                                    id="title"
                                    {...register('title')}
                                    aria-invalid={!!errors.title}
                                />
                                {errors.title && <FieldError errors={[errors.title]} />}
                            </Field>

                            <Field data-invalid={!!errors.description}>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea
                                    id="description"
                                    {...register('description')}
                                    aria-invalid={!!errors.description}
                                />
                                {errors.description && <FieldError errors={[errors.description]} />}
                            </Field>

                            <Field data-invalid={!!errors.program}>
                                <FieldLabel htmlFor="program">Programme</FieldLabel>
                                <Textarea
                                    id="program"
                                    rows={6}
                                    {...register('program')}
                                    aria-invalid={!!errors.program}
                                />
                                {errors.program && <FieldError errors={[errors.program]} />}
                            </Field>

                            <Field className="grid grid-cols-2 gap-4">
                                <Field data-invalid={!!errors.start_date}>
                                    <FieldLabel htmlFor="start_date">Date de début</FieldLabel>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        data-cy="start-date"
                                        {...register('start_date')}
                                        aria-invalid={!!errors.start_date}
                                    />
                                    {errors.start_date && (
                                        <FieldError errors={[errors.start_date]} />
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.end_date}>
                                    <FieldLabel htmlFor="end_date">Date de fin</FieldLabel>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        data-cy="end-date"
                                        {...register('end_date')}
                                        aria-invalid={!!errors.end_date}
                                    />
                                    {errors.end_date && <FieldError errors={[errors.end_date]} />}
                                </Field>
                            </Field>

                            <Field data-invalid={!!errors.status}>
                                <FieldLabel>Statut</FieldLabel>
                                <Select
                                    value={status}
                                    onValueChange={(value) =>
                                        setValue(
                                            'status',
                                            value as EventCreationFormValues['status'],
                                            { shouldValidate: true, shouldDirty: true },
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        className="w-full"
                                        aria-invalid={!!errors.status}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eventStatusOptions.map((value) => (
                                            <SelectItem key={value} value={value}>
                                                {eventStatusLabel[value]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && <FieldError errors={[errors.status]} />}
                            </Field>

                            <fieldset className="flex flex-col gap-3 rounded-lg border border-base-300 shadow p-4">
                                <legend className="px-1 text-sm font-medium">Adresse</legend>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field data-invalid={!!errors.address?.street_number}>
                                        <FieldLabel htmlFor="address.street_number">
                                            Numéro
                                        </FieldLabel>
                                        <Input
                                            id="address.street_number"
                                            data-cy="address-number"
                                            {...register('address.street_number')}
                                            aria-invalid={!!errors.address?.street_number}
                                        />
                                        {errors.address?.street_number && (
                                            <FieldError errors={[errors.address.street_number]} />
                                        )}
                                    </Field>
                                    <Field data-invalid={!!errors.address?.street_name}>
                                        <FieldLabel htmlFor="address.street_name">
                                            Nom de rue
                                        </FieldLabel>
                                        <Input
                                            id="address.street_name"
                                            data-cy="address-street-name"
                                            {...register('address.street_name')}
                                            aria-invalid={!!errors.address?.street_name}
                                        />
                                        {errors.address?.street_name && (
                                            <FieldError errors={[errors.address.street_name]} />
                                        )}
                                    </Field>
                                </div>

                                <Field data-invalid={!!errors.address?.address_line_2}>
                                    <FieldLabel htmlFor="address.address_line_2">
                                        Complément d'adresse
                                    </FieldLabel>
                                    <Input
                                        id="address.address_line_2"
                                        data-cy="address-line2"
                                        {...register('address.address_line_2')}
                                        aria-invalid={!!errors.address?.address_line_2}
                                    />
                                    {errors.address?.address_line_2 && (
                                        <FieldError errors={[errors.address.address_line_2]} />
                                    )}
                                </Field>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field data-invalid={!!errors.address?.postal_code}>
                                        <FieldLabel htmlFor="address.postal_code">
                                            Code postal
                                        </FieldLabel>
                                        <Input
                                            id="address.postal_code"
                                            data-cy="address-pc"
                                            {...register('address.postal_code')}
                                            aria-invalid={!!errors.address?.postal_code}
                                        />
                                        {errors.address?.postal_code && (
                                            <FieldError errors={[errors.address.postal_code]} />
                                        )}
                                    </Field>
                                    <Field data-invalid={!!errors.address?.city}>
                                        <FieldLabel htmlFor="address.city">Ville</FieldLabel>
                                        <Input
                                            id="address.city"
                                            data-cy="city"
                                            {...register('address.city')}
                                            aria-invalid={!!errors.address?.city}
                                        />
                                        {errors.address?.city && (
                                            <FieldError errors={[errors.address.city]} />
                                        )}
                                    </Field>
                                </div>

                                <Field data-invalid={!!errors.address?.country}>
                                    <FieldLabel htmlFor="address.country">Pays</FieldLabel>
                                    <Input
                                        id="address.country"
                                        data-cy="country"
                                        {...register('address.country')}
                                        aria-invalid={!!errors.address?.country}
                                    />
                                    {errors.address?.country && (
                                        <FieldError errors={[errors.address.country]} />
                                    )}
                                </Field>
                            </fieldset>

                            {error && <p className="text-error text-sm">{error}</p>}
                        </FieldGroup>
                    </CardContent>
                    <CardFooter className="mt-4">
                        <Button
                            className="w-full"
                            data-cy="submit-event"
                            disabled={isSubmitting || !isDirty || !isValid}
                        >
                            {isSubmitting ? 'Création...' : "Créer l'évènement"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
