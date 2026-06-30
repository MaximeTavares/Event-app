import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    SlotCreationInputValues,
    SlotCreationOutputValues,
    SlotCreationSchema,
    SlotFormValues,
} from '@app/contracts';

const SLOT_FORM_STATUS = ['OPEN', 'CANCELLED'] as const;
const SLOT_FORM_STATUS_LABEL: Record<(typeof SLOT_FORM_STATUS)[number], string> = {
    OPEN: 'Ouvert',
    CANCELLED: 'Annulé',
};

type SlotFormProps = {
    onSubmit: (data: SlotFormValues) => Promise<void>;
    isSubmitting?: boolean;
    error?: boolean | string | null;
    defaultValues?: SlotCreationInputValues;
};

export function SlotForm({
    onSubmit,
    isSubmitting,
    error,
    defaultValues,
    className,
    ...props
}: Readonly<SlotFormProps & Omit<React.ComponentProps<'form'>, 'onSubmit'>>) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
    } = useForm<SlotCreationInputValues, unknown, SlotCreationOutputValues>({
        resolver: zodResolver(SlotCreationSchema),
        mode: 'onChange',
        defaultValues,
    });

    const isEdit = defaultValues !== undefined;

    return (
        <form
            id="slot-form"
            onSubmit={handleSubmit(onSubmit)}
            className={cn('flex flex-col gap-4', className)}
            {...props}
        >
            <FieldGroup>
                <Controller
                    name="status"
                    control={control}
                    defaultValue="OPEN"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Statut</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id={field.name}>
                                    <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SLOT_FORM_STATUS.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {SLOT_FORM_STATUS_LABEL[s]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Field data-invalid={!!errors.start_at}>
                    <FieldLabel htmlFor="start_at">Date de début</FieldLabel>
                    <Input
                        {...register('start_at')}
                        id="start_at"
                        type="datetime-local"
                        step="900"
                        aria-invalid={!!errors.start_at}
                    />
                    {errors.start_at && <FieldError errors={[errors.start_at]} />}
                </Field>

                <Field data-invalid={!!errors.end_at}>
                    <FieldLabel htmlFor="end_at">Date de fin</FieldLabel>
                    <Input
                        {...register('end_at')}
                        id="end_at"
                        type="datetime-local"
                        step="900"
                        aria-invalid={!!errors.end_at}
                    />
                    {errors.end_at && <FieldError errors={[errors.end_at]} />}
                </Field>

                <Field data-invalid={!!errors.max_participant}>
                    <FieldLabel htmlFor="max_participant">
                        Nombre maximum de participants
                    </FieldLabel>
                    <Input
                        {...register('max_participant')}
                        id="max_participant"
                        type="number"
                        min={1}
                        aria-invalid={!!errors.max_participant}
                    />
                    {errors.max_participant && <FieldError errors={[errors.max_participant]} />}
                </Field>

                {error && (
                    <p className="text-sm text-destructive">
                        {typeof error === 'string' ? error : 'Une erreur est survenue.'}
                    </p>
                )}

                <Button
                    type="submit"
                    form="slot-form"
                    className="w-full"
                    disabled={!isValid || isSubmitting || (isEdit && !isDirty)}
                >
                    {isSubmitting
                        ? isEdit
                            ? 'Mise à jour…'
                            : 'Création…'
                        : isEdit
                          ? 'Modifier le créneau'
                          : 'Créer le créneau'}
                </Button>
            </FieldGroup>
        </form>
    );
}
