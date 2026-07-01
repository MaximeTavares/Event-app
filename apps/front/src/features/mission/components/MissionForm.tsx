import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    MISSION_STATUS,
    MissionCreationFormValues,
    MissionCreationSchema,
    missionStatusLabel,
} from '@app/contracts';

type MissionFormProps = {
    onSubmit: (data: MissionCreationFormValues) => Promise<void>;
    isSubmitting?: boolean;
    error?: string | null | boolean;
    defaultValues?: Partial<MissionCreationFormValues>;
    mode?: 'create' | 'edit';
};

export function MissionForm({
    onSubmit,
    isSubmitting,
    error,
    defaultValues,
    mode = 'create',
    className,
    ...props
}: Readonly<MissionFormProps & Omit<React.ComponentProps<'form'>, 'onSubmit'>>) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
    } = useForm<MissionCreationFormValues>({
        resolver: zodResolver(MissionCreationSchema),
        mode: 'onChange',
        defaultValues: {
            status: 'OPEN',
            ...defaultValues,
        },
    });

    const isEdit = mode === 'edit';

    return (
        <form id="mission-form" onSubmit={handleSubmit(onSubmit)} className={className} {...props}>
            <FieldGroup>
                <Field data-invalid={!!errors.title}>
                    <FieldLabel htmlFor="title">Titre</FieldLabel>
                    <Input
                        {...register('title')}
                        id="title"
                        placeholder="Nom de la mission"
                        aria-invalid={!!errors.title}
                    />
                    {errors.title && <FieldError errors={[errors.title]} />}
                </Field>

                <Field data-invalid={!!errors.description}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        {...register('description')}
                        id="description"
                        placeholder="Décrivez les responsabilités et objectifs de la mission"
                        aria-invalid={!!errors.description}
                    />
                    {errors.description && <FieldError errors={[errors.description]} />}
                </Field>

                <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Statut</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id={field.name}>
                                    <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MISSION_STATUS.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {missionStatusLabel[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                    type="submit"
                    form="mission-form"
                    className="w-full"
                    disabled={!isValid || isSubmitting || (isEdit && !isDirty)}
                >
                    {isSubmitting
                        ? isEdit
                            ? 'Mise à jour…'
                            : 'Création…'
                        : isEdit
                          ? 'Mettre à jour'
                          : 'Créer la mission'}
                </Button>
            </FieldGroup>
        </form>
    );
}
