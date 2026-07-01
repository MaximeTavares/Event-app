import { AvailabilityDto, availabilitySchema, WEEK_DAYS, WeekDay } from '@app/contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FieldGroup } from '@/components/ui/field';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const DAY_LABELS: Record<WeekDay, string> = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
};

type AvailabilityFormProps = {
    onSubmit: (data: AvailabilityDto) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
    defaultValues: AvailabilityDto;
};

export function AvailabilityForm({
    onSubmit,
    isSubmitting,
    error,
    defaultValues,
    className,
    ...props
}: Readonly<AvailabilityFormProps & Omit<React.ComponentProps<'div'>, 'onSubmit'>>) {
    const {
        control,
        handleSubmit,
        formState: { isDirty },
    } = useForm<AvailabilityDto>({
        resolver: zodResolver(availabilitySchema),
        defaultValues,
    });

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Disponibilités</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="availability-form" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <p className="text-sm text-muted-foreground">
                                Indiquez les jours où vous êtes généralement disponible.
                            </p>

                            <ul className="flex flex-col gap-3">
                                {WEEK_DAYS.map((day) => (
                                    <li key={day}>
                                        <Controller
                                            name={day}
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                                                    <span className="text-sm font-medium">
                                                        {DAY_LABELS[day]}
                                                    </span>
                                                    <Switch
                                                        id={field.name}
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </li>
                                ))}
                            </ul>

                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </FieldGroup>
                    </form>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full"
                        type="submit"
                        form="availability-form"
                        disabled={isSubmitting || !isDirty}
                    >
                        {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
