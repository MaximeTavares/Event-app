import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    EventCreationFormValues,
    eventCreationSchema,
    eventStatusLabel,
    eventStatusOptions,
} from '@app/contracts';

type EventFormProps = {
    onSubmit: (data: EventCreationFormValues) => Promise<void>;
    isSubmitting?: boolean;
    error?: string | null | boolean;
    defaultValues?: Partial<EventCreationFormValues>;
    mode?: 'create' | 'edit';
};

export function EventForm({
    onSubmit,
    isSubmitting,
    error,
    defaultValues,
    mode = 'create',
    className,
    ...props
}: Readonly<EventFormProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>>) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = useForm<EventCreationFormValues>({
        resolver: zodResolver(eventCreationSchema),
        mode: 'onChange',
        defaultValues: {
            status: 'DRAFT',
            ...defaultValues,
        },
    });

    const isEdit = mode === 'edit';

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {isEdit ? "Modifier l'évènement" : 'Créer un évènement'}
                    </CardTitle>
                </CardHeader>

                <form id="event-form" onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <FieldGroup>
                            {/* INFORMATIONS GÉNÉRALES */}
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

                            {/* DATES */}
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

                            {/* STATUT */}
                            <Controller
                                name="status"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Statut</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger
                                                id={field.name}
                                                aria-invalid={fieldState.invalid}
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
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Separator />

                            {/* ADRESSE */}
                            <fieldset className="flex flex-col gap-3 rounded-lg border p-4">
                                <legend className="px-1 text-sm font-medium">Adresse</legend>

                                <Field className="grid grid-cols-2 gap-3">
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
                                </Field>

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

                                <Field className="grid grid-cols-2 gap-3">
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
                                </Field>

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

                            {error && (
                                <p className="text-sm text-destructive">
                                    {typeof error === 'string' ? error : 'Une erreur est survenue.'}
                                </p>
                            )}
                        </FieldGroup>
                    </CardContent>

                    <CardFooter className="mt-4">
                        <Button
                            type="submit"
                            form="event-form"
                            className="w-full"
                            data-cy="submit-event"
                            disabled={isSubmitting || !isDirty || !isValid}
                        >
                            {isSubmitting
                                ? isEdit
                                    ? 'Mise à jour...'
                                    : 'Création...'
                                : isEdit
                                  ? "Mettre à jour l'évènement"
                                  : "Créer l'évènement"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
