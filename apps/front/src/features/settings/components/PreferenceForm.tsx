import { PreferencesDto, preferencesSchema } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PreferencesFormProps = {
    onSubmit: (data: PreferencesDto) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
    defaultValues: PreferencesDto;
};

export function PreferenceForm({
    onSubmit,
    isSubmitting,
    defaultValues,
    error,
    className,
    ...props
}: Readonly<PreferencesFormProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>>) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<PreferencesDto>({
        resolver: zodResolver(preferencesSchema),
        defaultValues,
    });

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Préférences</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="preferences-form" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            {/* AFFICHAGE */}
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Affichage
                            </p>

                            <Controller
                                name="fontSize"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Taille du texte
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sm">Petit</SelectItem>
                                                <SelectItem value="md">Moyen</SelectItem>
                                                <SelectItem value="lg">Grand</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="highContrast"
                                control={control}
                                render={({ field }) => (
                                    <Field>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel htmlFor={field.name}>
                                                Mode contraste élevé
                                            </FieldLabel>
                                            <Switch
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    </Field>
                                )}
                            />

                            <Separator />

                            {/* FORMATS */}
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Formats
                            </p>

                            <Controller
                                name="timeFormat"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Format de l'heure
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="24">24 h</SelectItem>
                                                <SelectItem value="12">12 h</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="dateFormat"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Format de date</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="eu">JJ/MM/AAAA</SelectItem>
                                                <SelectItem value="us">MM/JJ/AAAA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="distanceUnit"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Unité de distance
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="km">Kilomètres</SelectItem>
                                                <SelectItem value="mi">Miles</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="language"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Langue</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fr">Français</SelectItem>
                                                <SelectItem value="en">English</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Separator />

                            {/* CONFIDENTIALITÉ */}
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Confidentialité
                            </p>

                            <Controller
                                name="profileVisibility"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Visibilité du profil
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="events_only">
                                                    Membres de mes événements uniquement
                                                </SelectItem>
                                                <SelectItem value="organizers_only">
                                                    Organisateurs uniquement
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="showEmail"
                                control={control}
                                render={({ field }) => (
                                    <Field>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel htmlFor={field.name}>
                                                Afficher mon email aux autres
                                            </FieldLabel>
                                            <Switch
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    </Field>
                                )}
                            />

                            <Controller
                                name="showPhone"
                                control={control}
                                render={({ field }) => (
                                    <Field>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel htmlFor={field.name}>
                                                Afficher mon téléphone aux autres
                                            </FieldLabel>
                                            <Switch
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    </Field>
                                )}
                            />

                            <Separator />

                            {/* NAVIGATION */}
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Navigation
                            </p>

                            <Field data-invalid={!!errors.defaultCalendarView}>
                                <FieldLabel htmlFor="defaultCalendarView">
                                    Vue par défaut du calendrier
                                </FieldLabel>
                                <Input
                                    {...register('defaultCalendarView')}
                                    id="defaultCalendarView"
                                    aria-invalid={!!errors.defaultCalendarView}
                                />
                                {errors.defaultCalendarView && (
                                    <FieldError errors={[errors.defaultCalendarView]} />
                                )}
                            </Field>

                            <Field data-invalid={!!errors.defaultSearchCity}>
                                <FieldLabel htmlFor="defaultSearchCity">
                                    Ville ou zone de recherche par défaut
                                </FieldLabel>
                                <Input
                                    {...register('defaultSearchCity')}
                                    id="defaultSearchCity"
                                    aria-invalid={!!errors.defaultSearchCity}
                                />
                                {errors.defaultSearchCity && (
                                    <FieldError errors={[errors.defaultSearchCity]} />
                                )}
                            </Field>

                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    {' '}
                    <Button
                        className="w-full"
                        form="preferences-form"
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                    >
                        {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
